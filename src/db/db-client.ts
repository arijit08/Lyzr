




// TODO: Add persistent layer

export const dbClient = {


    findUser: async (username: String): Promise<{ id: String, passwordHash: string, role: string} | null> => {
        if (username) {
            return {
                id: 'user_${username}',
                passwordHash: '12345678',
                role: 'admin'
            };
        }
        return null;
    },


    verifyPassword: async (password: String, passwordHash: String): Promise<{ passwordValid: boolean } | null> => {
        if (password == passwordHash) {
            return {
                passwordValid: true
            };
        }
        return {
            passwordValid: false
        }
    }
}