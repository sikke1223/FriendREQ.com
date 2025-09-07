// Admin Panel JavaScript
const ADMIN_CREDENTIALS = {
    email: 'admin@monkeymoney.com',
    password: 'admin123'
};

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.checkAdminAuth();
        this.bindEvents();
        this.loadDashboard();
        this.startAutoRefresh();
    }

    checkAdminAuth() {
        const adminSession = localStorage.getItem('monkeymoney_current_admin');
        if (!adminSession) {
            this.showLoginOverlay();
        } else {
            this.hideLoginOverlay();
        }
    }

    showLoginOverlay() {
        document.getElementById('loginOverlay').style.display = 'flex';
    }

    hideLoginOverlay() {
        document.getElementById('loginOverlay').style.display = 'none';
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Search and filter inputs
        this.bindSearchAndFilters();
    }

    bindSearchAndFilters() {
        // User search and filter
        document.getElementById('userSearch').addEventListener('input', () => {
            this.filterUsers();
        });
        
        document.getElementById('membershipFilter').addEventListener('change', () => {
            this.filterUsers();
        });

        // Deposit search and filter
        document.getElementById('depositSearch').addEventListener('input', () => {
            this.filterDeposits();
        });
        
        document.getElementById('depositFilter').addEventListener('change', () => {
            this.filterDeposits();
        });

        // Withdrawal search and filter
        document.getElementById('withdrawalSearch').addEventListener('input', () => {
            this.filterWithdrawals();
        });
        
        document.getElementById('withdrawalFilter').addEventListener('change', () => {
            this.filterWithdrawals();
        });
    }

    handleLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const adminSession = {
                email: email,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('monkeymoney_current_admin', JSON.stringify(adminSession));
            this.hideLoginOverlay();
            this.loadDashboard();
            
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome to MonkeyMoney Admin Panel',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials. Please try again.'
            });
        }
    }

    handleLogout() {
        Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('monkeymoney_current_admin');
                this.showLoginOverlay();
                this.currentSection = 'dashboard';
                this.updateBreadcrumb('Dashboard');
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    }

    switchSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Hide all sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.add('hidden');
        });

        // Show selected section
        document.getElementById(`${section}Section`).classList.remove('hidden');

        // Update breadcrumb
        const sectionNames = {
            dashboard: 'Dashboard',
            users: 'Users',
            deposits: 'Deposits',
            withdrawals: 'Withdrawals'
        };
        this.updateBreadcrumb(sectionNames[section]);

        // Load section data
        this.currentSection = section;
        this.loadSectionData(section);

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('show');
        }
    }

    updateBreadcrumb(text) {
        document.getElementById('breadcrumbText').textContent = text;
    }

    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'deposits':
                this.loadDeposits();
                break;
            case 'withdrawals':
                this.loadWithdrawals();
                break;
        }
    }

    loadDashboard() {
        const users = getUsers();
        const deposits = getDeposits();
        const withdrawals = getWithdrawals();

        // Update statistics
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('pendingDeposits').textContent = 
            deposits.filter(d => d.status === 'pending').length;
        document.getElementById('pendingWithdrawals').textContent = 
            withdrawals.filter(w => w.status === 'pending').length;
        
        const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
        document.getElementById('totalBalance').textContent = `Rs. ${formatCurrency(totalBalance)}`;

        // Load recent activities
        this.loadRecentActivities();
    }

    loadRecentActivities() {
        const deposits = getDeposits();
        const withdrawals = getWithdrawals();
        const users = getUsers();

        // Combine and sort by date
        const activities = [
            ...deposits.map(d => ({ ...d, type: 'Deposit' })),
            ...withdrawals.map(w => ({ ...w, type: 'Withdrawal' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

        const tbody = document.getElementById('recentActivities');
        if (activities.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No recent activities</td></tr>';
            return;
        }

        tbody.innerHTML = activities.map(activity => {
            const user = users.find(u => u.id === activity.userId) || { fullName: 'Unknown User' };
            return `
                <tr>
                    <td>
                        <span class="badge ${activity.type.toLowerCase()}">${activity.type}</span>
                    </td>
                    <td>${user.fullName}</td>
                    <td>Rs. ${formatCurrency(activity.amount)}</td>
                    <td>
                        <span class="badge ${activity.status}">${activity.status}</span>
                    </td>
                    <td>${formatDate(activity.createdAt)}</td>
                </tr>
            `;
        }).join('');
    }

    loadUsers() {
        const users = getUsers();
        this.renderUsersTable(users);
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('usersTable');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id.substring(0, 8)}...</td>
                <td>${user.fullName || user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>Rs. ${formatCurrency(user.balance || 0)}</td>
                <td>
                    <span class="badge ${user.membership || 'basic'}">${user.membership || 'basic'}</span>
                </td>
                <td>${formatDate(user.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="admin.editUserBalance('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-info btn-sm" onclick="admin.viewUserDetails('${user.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const membershipFilter = document.getElementById('membershipFilter').value;
        
        let users = getUsers();

        if (searchTerm) {
            users = users.filter(user => 
                (user.fullName || '').toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                (user.phone || '').includes(searchTerm)
            );
        }

        if (membershipFilter) {
            users = users.filter(user => (user.membership || 'basic') === membershipFilter);
        }

        this.renderUsersTable(users);
    }

    loadDeposits() {
        const deposits = getDeposits();
        this.renderDepositsTable(deposits);
    }

    renderDepositsTable(deposits) {
        const tbody = document.getElementById('depositsTable');
        const users = getUsers();
        
        if (deposits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No deposits found</td></tr>';
            return;
        }

        tbody.innerHTML = deposits.map(deposit => {
            const user = users.find(u => u.id === deposit.userId) || { fullName: 'Unknown User' };
            return `
                <tr>
                    <td>${deposit.id.substring(0, 8)}...</td>
                    <td>${user.fullName}</td>
                    <td>Rs. ${formatCurrency(deposit.amount)}</td>
                    <td>${deposit.method}</td>
                    <td>${deposit.accountNumber}</td>
                    <td>
                        <span class="badge ${deposit.status}">${deposit.status}</span>
                    </td>
                    <td>${formatDate(deposit.createdAt)}</td>
                    <td>
                        <div class="action-buttons">
                            ${deposit.status === 'pending' ? `
                                <button class="btn btn-success btn-sm" onclick="admin.approveDeposit('${deposit.id}')">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="admin.rejectDeposit('${deposit.id}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-info btn-sm" onclick="admin.viewDepositDetails('${deposit.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterDeposits() {
        const searchTerm = document.getElementById('depositSearch').value.toLowerCase();
        const statusFilter = document.getElementById('depositFilter').value;
        
        let deposits = getDeposits();
        const users = getUsers();

        if (searchTerm) {
            deposits = deposits.filter(deposit => {
                const user = users.find(u => u.id === deposit.userId) || {};
                return (user.fullName || '').toLowerCase().includes(searchTerm) ||
                       deposit.accountNumber.toLowerCase().includes(searchTerm) ||
                       deposit.method.toLowerCase().includes(searchTerm);
            });
        }

        if (statusFilter) {
            deposits = deposits.filter(deposit => deposit.status === statusFilter);
        }

        this.renderDepositsTable(deposits);
    }

    loadWithdrawals() {
        const withdrawals = getWithdrawals();
        this.renderWithdrawalsTable(withdrawals);
    }

    renderWithdrawalsTable(withdrawals) {
        const tbody = document.getElementById('withdrawalsTable');
        const users = getUsers();
        
        if (withdrawals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No withdrawals found</td></tr>';
            return;
        }

        tbody.innerHTML = withdrawals.map(withdrawal => {
            const user = users.find(u => u.id === withdrawal.userId) || { fullName: 'Unknown User' };
            return `
                <tr>
                    <td>${withdrawal.id.substring(0, 8)}...</td>
                    <td>${user.fullName}</td>
                    <td>Rs. ${formatCurrency(withdrawal.amount)}</td>
                    <td>${withdrawal.method}</td>
                    <td>${withdrawal.accountNumber}</td>
                    <td>${withdrawal.accountTitle || 'N/A'}</td>
                    <td>
                        <span class="badge ${withdrawal.status}">${withdrawal.status}</span>
                    </td>
                    <td>${formatDate(withdrawal.createdAt)}</td>
                    <td>
                        <div class="action-buttons">
                            ${withdrawal.status === 'pending' ? `
                                <button class="btn btn-success btn-sm" onclick="admin.approveWithdrawal('${withdrawal.id}')">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="admin.rejectWithdrawal('${withdrawal.id}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-info btn-sm" onclick="admin.viewWithdrawalDetails('${withdrawal.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterWithdrawals() {
        const searchTerm = document.getElementById('withdrawalSearch').value.toLowerCase();
        const statusFilter = document.getElementById('withdrawalFilter').value;
        
        let withdrawals = getWithdrawals();
        const users = getUsers();

        if (searchTerm) {
            withdrawals = withdrawals.filter(withdrawal => {
                const user = users.find(u => u.id === withdrawal.userId) || {};
                return (user.fullName || '').toLowerCase().includes(searchTerm) ||
                       withdrawal.accountNumber.toLowerCase().includes(searchTerm) ||
                       withdrawal.method.toLowerCase().includes(searchTerm) ||
                       (withdrawal.accountTitle || '').toLowerCase().includes(searchTerm);
            });
        }

        if (statusFilter) {
            withdrawals = withdrawals.filter(withdrawal => withdrawal.status === statusFilter);
        }

        this.renderWithdrawalsTable(withdrawals);
    }

    // Transaction management methods
    approveDeposit(depositId) {
        Swal.fire({
            title: 'Approve Deposit',
            text: 'Are you sure you want to approve this deposit?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve'
        }).then((result) => {
            if (result.isConfirmed) {
                const deposits = getDeposits();
                const deposit = deposits.find(d => d.id === depositId);
                
                if (deposit) {
                    deposit.status = 'approved';
                    deposit.approvedAt = new Date().toISOString();
                    
                    // Update user balance and handle network marketing logic
                    const users = getUsers();
                    const user = users.find(u => u.id === deposit.userId);
                    if (user) {
                        user.balance = (user.balance || 0) + deposit.amount;
                        
                        // Check if this is the user's first approved deposit - unlock premium
                        const userDeposits = deposits.filter(d => d.userId === user.id && d.status === 'approved');
                        if (userDeposits.length === 1) { // First approved deposit
                            user.membership = 'premium';
                            user.premiumUnlockedAt = new Date().toISOString();
                            
                            // Handle referral commission if user was referred
                            if (user.referredBy) {
                                const referrer = users.find(u => u.referralCode === user.referredBy);
                                if (referrer) {
                                    const commission = Math.floor(deposit.amount * 0.5); // 50% to referrer
                                    const adminCommission = Math.floor(deposit.amount * 0.5); // 50% to admin
                                    
                                    referrer.balance = (referrer.balance || 0) + commission;
                                    referrer.totalReferralEarnings = (referrer.totalReferralEarnings || 0) + commission;
                                    
                                    // Track commission transaction
                                    if (!referrer.referralCommissions) {
                                        referrer.referralCommissions = [];
                                    }
                                    referrer.referralCommissions.push({
                                        id: generateId(),
                                        fromUser: user.fullName,
                                        fromUserId: user.id,
                                        amount: commission,
                                        adminShare: adminCommission,
                                        depositId: deposit.id,
                                        createdAt: new Date().toISOString()
                                    });
                                    
                                    // Track total referral count
                                    if (!referrer.totalReferrals) {
                                        referrer.totalReferrals = 0;
                                    }
                                    referrer.totalReferrals++;
                                }
                            }
                        }
                        
                        saveUsers(users);
                    }
                    
                    saveDeposits(deposits);
                    this.loadSectionData(this.currentSection);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Deposit Approved',
                        html: user && user.membership === 'premium' ? 
                            'User balance updated successfully.<br><strong>User premium status unlocked!</strong>' :
                            'User balance has been updated successfully.',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }

    rejectDeposit(depositId) {
        Swal.fire({
            title: 'Reject Deposit',
            text: 'Are you sure you want to reject this deposit?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, reject'
        }).then((result) => {
            if (result.isConfirmed) {
                const deposits = getDeposits();
                const deposit = deposits.find(d => d.id === depositId);
                
                if (deposit) {
                    deposit.status = 'rejected';
                    deposit.rejectedAt = new Date().toISOString();
                    
                    saveDeposits(deposits);
                    this.loadSectionData(this.currentSection);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Deposit Rejected',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }

    approveWithdrawal(withdrawalId) {
        Swal.fire({
            title: 'Approve Withdrawal',
            text: 'Are you sure you want to approve this withdrawal?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve'
        }).then((result) => {
            if (result.isConfirmed) {
                const withdrawals = getWithdrawals();
                const withdrawal = withdrawals.find(w => w.id === withdrawalId);
                
                if (withdrawal) {
                    withdrawal.status = 'approved';
                    withdrawal.approvedAt = new Date().toISOString();
                    
                    saveWithdrawals(withdrawals);
                    this.loadSectionData(this.currentSection);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Withdrawal Approved',
                        text: 'User will receive the funds soon.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }

    rejectWithdrawal(withdrawalId) {
        Swal.fire({
            title: 'Reject Withdrawal',
            text: 'Are you sure you want to reject this withdrawal?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, reject'
        }).then((result) => {
            if (result.isConfirmed) {
                const withdrawals = getWithdrawals();
                const withdrawal = withdrawals.find(w => w.id === withdrawalId);
                
                if (withdrawal) {
                    withdrawal.status = 'rejected';
                    withdrawal.rejectedAt = new Date().toISOString();
                    
                    // Refund user balance
                    const users = getUsers();
                    const user = users.find(u => u.id === withdrawal.userId);
                    if (user) {
                        user.balance = (user.balance || 0) + withdrawal.amount;
                        saveUsers(users);
                    }
                    
                    saveWithdrawals(withdrawals);
                    this.loadSectionData(this.currentSection);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Withdrawal Rejected',
                        text: 'User balance has been refunded.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }

    editUserBalance(userId) {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;

        Swal.fire({
            title: 'Edit User Balance',
            html: `
                <div class="text-start">
                    <p><strong>User:</strong> ${user.fullName}</p>
                    <p><strong>Current Balance:</strong> Rs. ${formatCurrency(user.balance || 0)}</p>
                    <label for="newBalance" class="form-label">New Balance:</label>
                    <input type="number" id="newBalance" class="form-control" value="${user.balance || 0}" min="0">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Balance',
            preConfirm: () => {
                const newBalance = parseFloat(document.getElementById('newBalance').value);
                if (isNaN(newBalance) || newBalance < 0) {
                    Swal.showValidationMessage('Please enter a valid amount');
                    return false;
                }
                return newBalance;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                user.balance = result.value;
                saveUsers(users);
                this.loadSectionData(this.currentSection);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Balance Updated',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    }

    viewUserDetails(userId) {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;

        Swal.fire({
            title: 'User Details',
            html: `
                <div class="text-start">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Full Name:</strong> ${user.fullName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                    <p><strong>Balance:</strong> Rs. ${formatCurrency(user.balance || 0)}</p>
                    <p><strong>Membership:</strong> ${user.membership || 'basic'}</p>
                    <p><strong>Referred By:</strong> ${user.referredBy || 'Direct'}</p>
                    <p><strong>Joined:</strong> ${formatDate(user.createdAt)}</p>
                </div>
            `,
            confirmButtonText: 'Close'
        });
    }

    viewDepositDetails(depositId) {
        const deposits = getDeposits();
        const deposit = deposits.find(d => d.id === depositId);
        
        if (!deposit) return;

        const users = getUsers();
        const user = users.find(u => u.id === deposit.userId) || { fullName: 'Unknown User' };

        Swal.fire({
            title: 'Deposit Details',
            html: `
                <div class="text-start">
                    <p><strong>ID:</strong> ${deposit.id}</p>
                    <p><strong>User:</strong> ${user.fullName}</p>
                    <p><strong>Amount:</strong> Rs. ${formatCurrency(deposit.amount)}</p>
                    <p><strong>Method:</strong> ${deposit.method}</p>
                    <p><strong>Account Number:</strong> ${deposit.accountNumber}</p>
                    <p><strong>Transaction ID:</strong> ${deposit.transactionId || 'N/A'}</p>
                    <p><strong>Status:</strong> ${deposit.status}</p>
                    <p><strong>Created:</strong> ${formatDate(deposit.createdAt)}</p>
                    ${deposit.approvedAt ? `<p><strong>Approved:</strong> ${formatDate(deposit.approvedAt)}</p>` : ''}
                    ${deposit.rejectedAt ? `<p><strong>Rejected:</strong> ${formatDate(deposit.rejectedAt)}</p>` : ''}
                </div>
            `,
            confirmButtonText: 'Close'
        });
    }

    viewWithdrawalDetails(withdrawalId) {
        const withdrawals = getWithdrawals();
        const withdrawal = withdrawals.find(w => w.id === withdrawalId);
        
        if (!withdrawal) return;

        const users = getUsers();
        const user = users.find(u => u.id === withdrawal.userId) || { fullName: 'Unknown User' };

        Swal.fire({
            title: 'Withdrawal Details',
            html: `
                <div class="text-start">
                    <p><strong>ID:</strong> ${withdrawal.id}</p>
                    <p><strong>User:</strong> ${user.fullName}</p>
                    <p><strong>Amount:</strong> Rs. ${formatCurrency(withdrawal.amount)}</p>
                    <p><strong>Method:</strong> ${withdrawal.method}</p>
                    <p><strong>Account Number:</strong> ${withdrawal.accountNumber}</p>
                    <p><strong>Account Title:</strong> ${withdrawal.accountTitle || 'N/A'}</p>
                    <p><strong>Status:</strong> ${withdrawal.status}</p>
                    <p><strong>Created:</strong> ${formatDate(withdrawal.createdAt)}</p>
                    ${withdrawal.approvedAt ? `<p><strong>Approved:</strong> ${formatDate(withdrawal.approvedAt)}</p>` : ''}
                    ${withdrawal.rejectedAt ? `<p><strong>Rejected:</strong> ${formatDate(withdrawal.rejectedAt)}</p>` : ''}
                </div>
            `,
            confirmButtonText: 'Close'
        });
    }

    startAutoRefresh() {
        // Refresh dashboard data every 30 seconds
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        }, 30000);
    }
}

// Initialize admin panel
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminPanel();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('show');
    }
});
