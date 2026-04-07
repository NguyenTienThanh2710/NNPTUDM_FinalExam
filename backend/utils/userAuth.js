let userModel = require("../schemas/users");
let roleModel = require("../schemas/roles");
let bcrypt = require('bcryptjs');

module.exports = {
    CreateAnUser: async function (username, password, email, role, session, fullName, avatarUrl, status, loginCount) {
        let roleId = undefined;

        if (role && typeof role === 'object' && role._id) {
            roleId = role._id;
        } else if (typeof role === 'string') {
            if (/^[0-9a-fA-F]{24}$/.test(role)) {
                roleId = role;
            } else {
                const roleDoc = await roleModel.findOne({ name: role.trim().toUpperCase() }).select('_id');
                roleId = roleDoc?._id;
            }
        }

        if (!roleId) {
            const roleDoc = await roleModel.findOne({ name: 'USER' }).select('_id');
            roleId = roleDoc?._id;
        }

        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

        let newUser = new userModel({
            username: username,
            password: passwordHash,
            email: email,
            name: fullName || username || email,
            avatar: avatarUrl,
            status: status || 'active',
            role_id: roleId,
            loginCount: typeof loginCount === 'number' ? loginCount : 0
        });

        await newUser.save(session ? { session } : undefined);
        return newUser;
    },
    FindUserByUsername: async function (username) {
        return await userModel.findOne({
            isDeleted: false,
            username: username
        });
    },
    FindUserByEmail: async function (email) {
        return await userModel.findOne({
            isDeleted: false,
            email: email
        });
    },
    FindUserByToken: async function (token) {
        let result = await userModel.findOne({
            isDeleted: false,
            forgotPasswordToken: token
        });
        if (result && result.forgotPasswordTokenExp && result.forgotPasswordTokenExp > Date.now()) {
            return result;
        }
        return false;
    },
    CompareLogin: async function (user, password) {
        if (!user) return false;

        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            user.lockTime = undefined;
            if (user.status === 'locked') user.status = 'active';
            await user.save();
            return user;
        }

        user.loginCount = (user.loginCount || 0) + 1;
        if (user.loginCount === 3) {
            user.lockTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
            user.loginCount = 0;
            user.status = 'locked';
        }
        await user.save();
        return false;
    },
    GetUserById: async function (id) {
        try {
            let user = await userModel.findOne({
                _id: id,
                isDeleted: false
            }).populate('role_id');
            return user;
        } catch (_error) {
            return false;
        }
    }
};
