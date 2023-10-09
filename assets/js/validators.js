function validate_text(text, field_name, min_length = 0, max_length = Number.MAX_SAFE_INTEGER) {
    if(text.length < min_length) {
        show_error_message(`El ${field_name} que ha ingresado debe tener al menos ${min_length} caracteres`)
        return false;
    }
    if(max_length<text.length) {
        show_error_message(`El ${field_name} que ha ingresado debe tener al menos ${max_length} caracteres`)
        return false;
    }
    for (let i = 0; i < text.length; i++) {
        if (!('a' <= text[i] && text[i] <= 'z') && !('A' <= text[i] && text[i] <= 'Z') && text[i] !== ' ' && text[i] !== 'ñ' && text[i] !== 'Ñ') {
            show_error_message(`El ${field_name} que ha ingresado no es valido`)
            return false;
        }
    }
    return true;
}
function validate_phone(number) {
    if(9 < number.length || number.length < 9) {
        show_error_message(`El telefono debe tener 9 digitos`)
        return false;
    }
    if(!('0' <= number[0] && number[0] <= '9')) {
        show_error_message(`Los números de teléfono deben empezar por 9`)
        return false;
    }
    for (let i = 1; i < number.length; i++) {
        if (!('0' <= number[i] && number[i] <= '9')) {
            show_error_message(`El telefono debe tener solo numeros`)
            return false;
        }
    }
    return true;
}
function validate_mail(email, min_length, max_length){
    if(email.length < min_length) {
        show_error_message(`El correo debe tener al menos ${min_length} caracteres`)
        return false;
    }
    if(max_length<email.length) {
        show_error_message(`El correo debe tener menos de ${max_length} caracteres`)
        return false;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!emailPattern.test(email)) {
        show_error_message(`El email no es válido`)
        return false;
    }
    return true
}