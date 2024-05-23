function Validation(values) {
    let error = {}
    // TODO: Swap for real username checks, not email checks
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.username === "") {
        error.username = "Name should not be empty"
    } else if(!email_pattern.test(values.username)) {
        error.username = "Username Didn't match"
    }else {
        error.username = ""
    }

    if(values.password === "") {
        error.password = "Password should not be empty"
    } else if(!password_pattern.test(values.password)) {
        error.password = "Password didn't match"
    } else {
        error.password = ""
    }

    if(values.gender === "") {
        error.gender = "Gender should not be empty"
    } else {
        error.gender = ""
    }

    if(values.birthday === "") {
        error.birthday = "birthday should not be empty"
    } else {
        error.birthday = ""
    }
    return error;
}
export default Validation;
