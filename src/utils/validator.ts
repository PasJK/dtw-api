class Validator {
    static PASSWORD_CRITERIA = [
        {
            key: "8char",
            contextKey: "passChar",
            title: "Must have at least 8 characters",
            check: (password: string) => this.password(password, "8char"),
        },
        {
            key: "1lowerCase",
            contextKey: "passLowerCase",
            title: "Must have at least 1 lower case letter",
            check: (password: string) => this.password(password, "1lowerCase"),
        },
        {
            key: "1upperCase",
            contextKey: "passUpperCase",
            title: "Must have at least 1 upper case letter",
            check: (password: string) => this.password(password, "1upperCase"),
        },
        {
            key: "1digit",
            contextKey: "passDigit",
            title: "Must have at least 1 number",
            check: (password: string) => this.password(password, "1digit"),
        },
        {
            key: "special",
            contextKey: "passSpecial",
            title: "Must have at least 1 special character",
            check: (password: string) => this.password(password, "special"),
        },
    ];

    static password(password: string, type: "all" | "8char" | "1lowerCase" | "1upperCase" | "1digit" | "special") {
        let isPass = false;
        if (!password) {
            return isPass;
        }

        switch (type) {
            case "8char":
                isPass = /^.{8,}$/g.test(password);
                break;
            case "1lowerCase":
                isPass = /^(.*[a-z].*)$/g.test(password);
                break;
            case "1upperCase":
                isPass = /^(.*[A-Z].*)$/g.test(password);
                break;
            case "1digit":
                isPass = /^(.*[0-9].*)$/g.test(password);
                break;
            case "special":
                isPass = /^(.*[@#$%^&+!/~|?*=()<>:,'.{}\[\]-].*)$/g.test(password);
                break;
            case "all":
                isPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@#$%^&+!/~|?*=()<>:,'.{}\[\]-]).{8,}$/g.test(
                    password,
                );
                break;
            default:
                break;
        }

        return isPass;
    }

    static email(email: string) {
        if (!email) {
            return false;
        }

        const trimmedEmail = email.trim();
        const emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.].{0,}$");
        return emailRegex.test(trimmedEmail);
    }

    static phoneNumber(value: string) {
        const trimmedValue = value.trim();
        const strongPhone = new RegExp("^[0]{1}?[0-9]{2}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{3,4}$");

        return strongPhone.test(trimmedValue);
    }
}

export default Validator;
