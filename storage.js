// Local storage management for MonkeyMoney

// Storage keys
const STORAGE_KEYS = {
    USERS: 'monkeymoney_users',
    DEPOSITS: 'monkeymoney_deposits',
    WITHDRAWALS: 'monkeymoney_withdrawals',
    CURRENT_USER: 'monkeymoney_current_user',
    CURRENT_ADMIN: 'monkeymoney_current_admin'
};

// Initialize storage with sample data if empty
function initializeStorage() {
    // Initialize users if empty
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const sampleUsers = [
            {
                id: '1640995200000abc123',
                username: 'john_doe',
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '03001234567',
                password: 'password123',
                balance: 5000,
                membership: 'premium',
                referralCode: 'JOHN123',
                referredBy: '',
                createdAt: '2023-01-01T10:00:00.000Z',
                lastLogin: '2024-01-15T08:30:00.000Z',
                emailVerified: true,
                isActive: true,
                premiumUnlockedAt: '2023-01-02T09:00:00.000Z',
                totalReferrals: 1,
                totalReferralEarnings: 750,
                referralCommissions: [{
                    id: '1640995200006xyz001',
                    fromUser: 'Jane Smith',
                    fromUserId: '1640995200001def456',
                    amount: 750,
                    adminShare: 750,
                    depositId: '1640995200003jkl012',
                    createdAt: '2023-02-16T09:00:00.000Z'
                }]
            },
            {
                id: '1640995200001def456',
                username: 'jane_smith',
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                phone: '03007654321',
                password: 'password123',
                balance: 2500,
                membership: 'premium',
                referralCode: 'JANE456',
                referredBy: 'JOHN123',
                createdAt: '2023-02-15T14:20:00.000Z',
                lastLogin: '2024-01-14T15:45:00.000Z',
                emailVerified: true,
                isActive: true,
                premiumUnlockedAt: '2023-02-16T09:00:00.000Z',
                totalReferrals: 0,
                totalReferralEarnings: 0,
                referralCommissions: []
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers));
    }

    // Initialize deposits if empty
    if (!localStorage.getItem(STORAGE_KEYS.DEPOSITS)) {
        const sampleDeposits = [
            {
                id: '1640995200002ghi789',
                userId: '1640995200000abc123',
                amount: 2000,
                method: 'JazzCash',
                accountNumber: '03001234567',
                transactionId: 'JC123456789',
                status: 'approved',
                createdAt: '2024-01-10T09:15:00.000Z',
                approvedAt: '2024-01-10T10:30:00.000Z'
            },
            {
                id: '1640995200003jkl012',
                userId: '1640995200001def456',
                amount: 1500,
                method: 'EasyPaisa',
                accountNumber: '03007654321',
                transactionId: 'EP987654321',
                status: 'approved',
                createdAt: '2023-02-15T16:20:00.000Z',
                approvedAt: '2023-02-16T09:00:00.000Z'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(sampleDeposits));
    }

    // Initialize withdrawals if empty
    if (!localStorage.getItem(STORAGE_KEYS.WITHDRAWALS)) {
        const sampleWithdrawals = [
            {
                id: '1640995200004mno345',
                userId: '1640995200000abc123',
                amount: 3000,
                method: 'BankTransfer',
                accountNumber: '1234567890123456',
                accountTitle: 'John Doe',
                status: 'approved',
                createdAt: '2024-01-12T11:30:00.000Z',
                approvedAt: '2024-01-12T14:45:00.000Z'
            },
            {
                id: '1640995200005pqr678',
                userId: '1640995200001def456',
                amount: 1200,
                method: 'JazzCash',
                accountNumber: '03007654321',
                accountTitle: 'Jane Smith',
                status: 'pending',
                createdAt: '2024-01-14T17:10:00.000Z'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(sampleWithdrawals));
    }
}

// User management functions
function getUsers() {
    try {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users to localStorage:', error);
        return false;
    }
}

function addUser(userData) {
    try {
        const users = getUsers();
        const newUser = {
            id: generateId(),
            balance: 0,
            membership: 'basic',
            createdAt: new Date().toISOString(),
            emailVerified: false,
            isActive: true,
            ...userData
        };
        
        users.push(newUser);
        saveUsers(users);
        return newUser;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

function updateUser(userId, updateData) {
    try {
        const users = getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        users[userIndex] = { ...users[userIndex], ...updateData };
        saveUsers(users);
        return users[userIndex];
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

function deleteUser(userId) {
    try {
        const users = getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        saveUsers(filteredUsers);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function findUserById(userId) {
    const users = getUsers();
    return users.find(user => user.id === userId);
}

// Deposit management functions
function getDeposits() {
    try {
        const deposits = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
        return deposits ? JSON.parse(deposits) : [];
    } catch (error) {
        console.error('Error reading deposits from localStorage:', error);
        return [];
    }
}

function saveDeposits(deposits) {
    try {
        localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
        return true;
    } catch (error) {
        console.error('Error saving deposits to localStorage:', error);
        return false;
    }
}

function addDeposit(depositData) {
    try {
        const deposits = getDeposits();
        const newDeposit = {
            id: generateId(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            ...depositData
        };
        
        deposits.push(newDeposit);
        saveDeposits(deposits);
        return newDeposit;
    } catch (error) {
        console.error('Error adding deposit:', error);
        throw error;
    }
}

function updateDeposit(depositId, updateData) {
    try {
        const deposits = getDeposits();
        const depositIndex = deposits.findIndex(deposit => deposit.id === depositId);
        
        if (depositIndex === -1) {
            throw new Error('Deposit not found');
        }
        
        deposits[depositIndex] = { ...deposits[depositIndex], ...updateData };
        saveDeposits(deposits);
        return deposits[depositIndex];
    } catch (error) {
        console.error('Error updating deposit:', error);
        throw error;
    }
}

// Withdrawal management functions
function getWithdrawals() {
    try {
        const withdrawals = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
        return withdrawals ? JSON.parse(withdrawals) : [];
    } catch (error) {
        console.error('Error reading withdrawals from localStorage:', error);
        return [];
    }
}

function saveWithdrawals(withdrawals) {
    try {
        localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
        return true;
    } catch (error) {
        console.error('Error saving withdrawals to localStorage:', error);
        return false;
    }
}

function addWithdrawal(withdrawalData) {
    try {
        const withdrawals = getWithdrawals();
        const newWithdrawal = {
            id: generateId(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            ...withdrawalData
        };
        
        withdrawals.push(newWithdrawal);
        saveWithdrawals(withdrawals);
        return newWithdrawal;
    } catch (error) {
        console.error('Error adding withdrawal:', error);
        throw error;
    }
}

function updateWithdrawal(withdrawalId, updateData) {
    try {
        const withdrawals = getWithdrawals();
        const withdrawalIndex = withdrawals.findIndex(withdrawal => withdrawal.id === withdrawalId);
        
        if (withdrawalIndex === -1) {
            throw new Error('Withdrawal not found');
        }
        
        withdrawals[withdrawalIndex] = { ...withdrawals[withdrawalIndex], ...updateData };
        saveWithdrawals(withdrawals);
        return withdrawals[withdrawalIndex];
    } catch (error) {
        console.error('Error updating withdrawal:', error);
        throw error;
    }
}

// Request processing functions
function requestDeposit(depositData) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be logged in to make a deposit');
        }

        const deposit = addDeposit({
            ...depositData,
            userId: currentUser.id
        });

        return deposit;
    } catch (error) {
        console.error('Error requesting deposit:', error);
        throw error;
    }
}

function requestWithdrawal(withdrawalData) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('User must be logged in to make a withdrawal');
        }

        // Check if user has sufficient balance
        if (currentUser.balance < withdrawalData.amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct amount from user balance (will be refunded if rejected)
        const users = getUsers();
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            user.balance -= withdrawalData.amount;
            saveUsers(users);
            setCurrentUser(user);
        }

        const withdrawal = addWithdrawal({
            ...withdrawalData,
            userId: currentUser.id
        });

        return withdrawal;
    } catch (error) {
        console.error('Error requesting withdrawal:', error);
        throw error;
    }
}

// Data export/import functions
function exportData() {
    try {
        const data = {
            users: getUsers(),
            deposits: getDeposits(),
            withdrawals: getWithdrawals(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
}

function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.users) {
            saveUsers(data.users);
        }
        
        if (data.deposits) {
            saveDeposits(data.deposits);
        }
        
        if (data.withdrawals) {
            saveWithdrawals(data.withdrawals);
        }
        
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
}

// Clear all data (for testing/reset purposes)
function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.DEPOSITS);
        localStorage.removeItem(STORAGE_KEYS.WITHDRAWALS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}

// Initialize storage on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
});
