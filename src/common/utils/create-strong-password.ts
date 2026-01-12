export const generateStrongPassword = () => {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const allChars = lowercase + uppercase + digits;
        
        let password = '';
        // Гарантируем наличие хотя бы одного символа каждого типа
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += digits[Math.floor(Math.random() * digits.length)];
        
        // Дополняем до 12 символов случайными символами из всех категорий
        for (let i = 0; i < 9; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Перемешиваем символы
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return password;
    };