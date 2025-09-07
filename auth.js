// Authentication functions for MonkeyMoney

// Register new user
async function registerUser(userData) {
    try {
        // Validate required fields
        if (!userData.username || !userData.fullName || !userData.email || !userData.password) {
            throw new Error('All fields are required');
        }

        // Validate email format
        if (!validateEmail(userData.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Validate phone number
        if (userData.phone && !validatePhone(userData.phone)) {
            throw new Error('Please enter a valid Pakistani phone number (03XXXXXXXXX)');
        }

        // Validate password strength
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Get existing users
        const users = getUsers();

        // Check if username already exists
        if (users.find(user => user.username.toLowerCase() === userData.username.toLowerCase())) {
            throw new Error('Username already exists');
        }

        // Check if email already exists
        if (users.find(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error('Email already registered');
        }

        // Generate user ID and referral code
        const userId = generateId();
        const referralCode = generateReferralCode(userData.username);

        // Create new user object
        const newUser = {
            id: userId,
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password, // In production, this should be hashed
            balance: 0,
            membership: 'basic',
            referralCode: referralCode,
            referredBy: userData.referredBy || '',
            createdAt: new Date().toISOString(),
            emailVerified: false,
            isActive: true
        };

        // Add bonus for referral
        if (userData.referredBy) {
            const referrer = users.find(user => user.referralCode === userData.referredBy);
            if (referrer) {
                referrer.balance += 100; // Referral bonus
                newUser.balance += 50; // Welcome bonus for referred user
            }
        }

        // Add user to storage
        users.push(newUser);
        saveUsers(users);

        return newUser;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Login user
async function loginUser(email, password) {
    try {
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Get users from storage
        const users = getUsers();

        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error('User not found. Please check your email or register a new account.');
        }

        // Check password (in production, use proper hash comparison)
        if (user.password !== password) {
            throw new Error('Invalid password. Please try again.');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Your account has been deactivated. Please contact support.');
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        saveUsers(users);

        // Set current user
        setCurrentUser(user);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';

        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Reset password
async function resetPassword(email) {
    try {
        if (!email) {
            throw new Error('Email is required');
        }

        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Get users from storage
        const users = getUsers();

        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error('No account found with this email address');
        }

        // In a real application, you would send an email here
        // For demo purposes, we'll just show a success message
        
        // Generate a temporary password (in production, use proper reset token)
        const tempPassword = 'temp' + Math.random().toString(36).substr(2, 8);
        user.password = tempPassword;
        user.passwordResetRequired = true;
        
        saveUsers(users);

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        showNotification(`Password reset successful. Temporary password: ${tempPassword}`, 'success', 10000);

        return true;
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('You must be logged in to change your password');
        }

        if (currentUser.password !== currentPassword) {
            throw new Error('Current password is incorrect');
        }

        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
        }

        if (currentPassword === newPassword) {
            throw new Error('New password must be different from current password');
        }

        // Update password in storage
        const users = getUsers();
        const user = users.find(u => u.id === currentUser.id);
        
        if (user) {
            user.password = newPassword;
            user.passwordResetRequired = false;
            user.passwordChangedAt = new Date().toISOString();
            
            saveUsers(users);
            setCurrentUser(user);
        }

        return true;
    } catch (error) {
        console.error('Password change error:', error);
        throw error;
    }
}

// Logout user
function logoutUser() {
    localStorage.removeItem('monkeymoney_current_user');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Get user role (basic or premium)
function getUserRole() {
    const user = getCurrentUser();
    return user ? user.membership : 'guest';
}

// Update user profile
async function updateUserProfile(profileData) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('You must be logged in to update your profile');
        }

        // Validate email if changed
        if (profileData.email && profileData.email !== currentUser.email) {
            if (!validateEmail(profileData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Check if email is already taken
            const users = getUsers();
            const emailExists = users.find(u => u.id !== currentUser.id && u.email.toLowerCase() === profileData.email.toLowerCase());
            if (emailExists) {
                throw new Error('Email is already registered to another account');
            }
        }

        // Validate phone if provided
        if (profileData.phone && !validatePhone(profileData.phone)) {
            throw new Error('Please enter a valid Pakistani phone number (03XXXXXXXXX)');
        }

        // Update user data
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            const updatedUser = {
                ...users[userIndex],
                ...profileData,
                updatedAt: new Date().toISOString()
            };
            
            users[userIndex] = updatedUser;
            saveUsers(users);
            setCurrentUser(updatedUser);
        }

        return true;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
}

// Upgrade user membership
async function upgradeMembership(membershipType) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('You must be logged in to upgrade membership');
        }

        if (currentUser.membership === membershipType) {
            throw new Error('You already have this membership level');
        }

        const membershipPrices = {
            premium: 2000
        };

        const price = membershipPrices[membershipType];
        if (!price) {
            throw new Error('Invalid membership type');
        }

        if (currentUser.balance < price) {
            throw new Error(`Insufficient balance. You need Rs. ${price} to upgrade to ${membershipType} membership.`);
        }

        // Deduct balance and update membership
        const users = getUsers();
        const user = users.find(u => u.id === currentUser.id);
        
        if (user) {
            user.balance -= price;
            user.membership = membershipType;
            user.membershipUpgradedAt = new Date().toISOString();
            
            saveUsers(users);
            setCurrentUser(user);
        }

        return true;
    } catch (error) {
        console.error('Membership upgrade error:', error);
        throw error;
    }
}

// Get user's referral statistics
function getReferralStats() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const users = getUsers();
    const referrals = users.filter(user => user.referredBy === currentUser.referralCode);

    return {
        totalReferrals: referrals.length,
        activeReferrals: referrals.filter(user => user.isActive).length,
        totalEarnings: referrals.length * 100, // Rs. 100 per referral
        referralCode: currentUser.referralCode,
        referrals: referrals.map(user => ({
            name: user.fullName,
            email: user.email,
            joinedAt: user.createdAt,
            isActive: user.isActive
        }))
    };
}
