let date = ""
let table_id = -1
let email = ""
let phone = ""
let name = ""
let last_name = ""
let user_id = -1 //Guarda el identificador del usuario en la db
let tables = [] //Guarda las mesas disponibles
let message = "void"

let email_input= document.getElementById('email');
let phone_input= document.getElementById('phone');
let name_input= document.getElementById('name');
let last_name_input= document.getElementById('last_name');
let date_selector= document.getElementById('date');
let tables_selector= document.getElementById('tables');
let tables_disabler= document.getElementById('tables-disabler');
let start_time_selector = document.getElementById("start");
let start_time_disabler= document.getElementById('start-disabler');
let end_time_selector= document.getElementById('end');
let end_time_disabler= document.getElementById('end-disabler');
let message_input= document.getElementById('message');
function enableNameInput(){
    user_id = -1;
    name_input.disabled = false;
    last_name_input.disabled = false;
}
function updateEmail(){
    email = email_input.value;
    validateElement(email_input)
}

function validateElement(element){
    element.removeAttribute('invalid')
}
function invalidateElement(element){
    element.setAttribute('invalid', true);
}
function emailChanged(){
    if(email_input.value === "") {
        email = "";
        invalidateElement(email_input)
        return;
    }
    if(validate_mail(email_input.value,5,50)){
        enableNameInput();
        if(phone_input.value){
            searchUser().then((userLoginSuccessful)=>{
                if(userLoginSuccessful) updateEmail()
                else doesEmailExists(true);
            })
        }
        else{
            updateEmail()
        }
    }
    else invalidateElement(email_input)
}
function updatePhone(){
    validateElement(phone_input)
    phone = phone_input.value;
}
function phoneChanged(){
    if(phone_input.value === "") {
        phone = "";
        invalidateElement(phone_input)
        return;
    }
    if(validate_phone(phone_input.value)){
        enableNameInput()
        if(email_input.value){
            searchUser().then((userLoginSuccessful)=>{
                if(userLoginSuccessful) updatePhone();
                else doesPhoneExists(true);
            })
        }
        else{
            phone = phone_input.value
        }
    }
    else invalidateElement(phone_input)
}

async function searchUser(){
    return await axios.get(`http://127.0.0.1:5000/api/v1/get_user_from_mail_phone?email=${email_input.value}&phone=${phone_input.value}`)
        .then(response => {
            response = response.data;
            if(response.name && response.last_name){
                console.log("User already registered:", response.name, response.last_name)
                validateElement(name_input)
                validateElement(last_name_input)
                validateElement(phone_input)
                validateElement(email_input)
                name_input.disabled = true;
                last_name_input.disabled = true;
                name_input.value = response.name;
                last_name_input.value = response.last_name
                name = response.name;
                last_name = response.last_name;
                user_id = response.id
                return true;
            }
            else {
                name_input.disabled = false;
                last_name_input.disabled = false;
                user_id = -1;
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function doesPhoneExists(checkEmail = false){
    axios.get(`http://127.0.0.1:5000/api/v1/check_phone?phone=${phone_input.value}`)
        .then(response => {
            response = response.data
            if(response) {
                if(response.exists){
                    show_error_message("Este telefono ya esta registrado a nombre de otro Email")
                    invalidateElement(phone_input)
                }
                else {
                    updatePhone()
                    if(checkEmail) doesEmailExists();
                }
                console.log("phoneExists",email, phone)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function doesEmailExists(checkEmail = false){
    axios.get(`http://127.0.0.1:5000/api/v1/check_email?email=${email_input.value}`)
        .then(response => {
            response = response.data
            if(response) {
                if(response.exists){
                    show_error_message("Este Email ya esta registrado a nombre de otro Telefono")
                    invalidateElement(email_input)
                }
                else {
                    updateEmail()
                    if(checkEmail) doesPhoneExists();
                }
                console.log("emailExists",email, phone)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function nameChanged(){
    if(name_input.value === "") {
        invalidateElement(name_input)
        name = "";
        return;
    }
    if(validate_text(name_input.value,'nombre',3,50)) {
        name = name_input.value;
        validateElement(name_input)
    }
    else invalidateElement(name_input)
}
function lastNameChanged(){
    if(last_name_input.value === "") {
        invalidateElement(last_name_input)
        last_name = "";
        return;
    }
    if(validate_text(last_name_input.value,'apellido', 3, 50)) {
        last_name = last_name_input.value;
        validateElement(last_name_input)
    }
    else invalidateElement(last_name_input)
}


function  disableTables(){
    tables_disabler.disabled = true;
    start_time_disabler.disabled = true;
    end_time_disabler.disabled = true;
}
function disableStartHour(){
    start_time_disabler.disabled = true;
    end_time_disabler.disabled = true;
}

function dateChanged(){
    let prevDate = date;
    validateElement(date_selector)
    if(date_selector.value){
        date = date_selector.value

        const today = new Date();
        today.setDate(today.getDate());
        const newMinDate = today.toISOString().split('T')[0];

        date = date.split(".")
        date = date[2] + '-' + date[1] + '-' + date[0]
        if(date <= newMinDate){
            invalidateElement(date_selector)
            show_error_message("La fecha debe ser posterior a hoy")
            date = prevDate
        }
        else if(date !== prevDate){
            loadPossibleTablesForDate()
        }
    }
}

function loadPossibleTablesForDate(){
    axios.get(`http://127.0.0.1:5000/api/v1/not_reserved_tables?date=${date}`)
        .then(response => {
            response = response.data;
            tables = [];
            if(response.length > 0){
                for (let i = 0; i < response.length; i++){
                    tables.push(response[i])
                }
            }
            else{
                show_error_message(`No existen mesas libres para la fecha ${date}`)
            }
            disableTables();
            showLoadedTables()
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function showLoadedTables(){
    tables_selector.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '-1';
    defaultOption.textContent = 'Selector de Mesa';
    tables_selector.appendChild(defaultOption);
    if(tables && tables.length > 0){
        for (let i = 0; i < tables.length; i++) {
            let newOption = document.createElement('option');
            newOption.value = tables[i].id;
            newOption.textContent = `Mesa #${tables[i].id}: ${tables[i].guests} invitados`
            tables_selector.appendChild(newOption);
        }
        tables_disabler.disabled = false;
    }
    else tables_disabler.disabled = true;
}


function selectedTableChanged(){
    if(tables_selector.value !== -1){
        table_id = tables_selector.value;
        getHoursFreeForTable()
    }
}

let hourList = []
let startTime = -1;
let endTime = -1;


function getHoursFreeForTable(){
    axios.get(`http://127.0.0.1:5000/api/v1/get_hours_per_table?date=${date}&table=${table_id}`)
        .then(response => {
            hourList = response.data
            if(hourList.length > 0){
                disableStartHour();
                initializeStartHour()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function initializeStartHour(){
    start_time_selector.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '-1';
    defaultOption.textContent = 'Hora Inicio';
    start_time_selector.appendChild(defaultOption);
    for (let i = 0; i < hourList.length; i++) {
        let newOption = document.createElement('option');
        newOption.value = hourList[i].id;
        newOption.textContent = `${hourList[i].hour}:${hourList[i].minute}`
        start_time_selector.appendChild(newOption);
    }
    start_time_disabler.disabled = false
}

function initializeEndHour(){
    end_time_selector.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '-1';
    defaultOption.textContent = 'Hora Fin';
    end_time_selector.appendChild(defaultOption);
    let nextID = -1;
    for (let i = 0; i < hourList.length; i++) {
        if(startTime <= hourList[i].id){
            if(nextID === -1){nextID = startTime;}
            else{nextID++}
            if(nextID >= startTime + 6) break;
            if(parseInt(hourList[i].id) === nextID){
                let newOption = document.createElement('option');
                newOption.value = hourList[i].id;
                newOption.textContent = `${hourList[i].next_hour}:${hourList[i].next_minute}`
                end_time_selector.appendChild(newOption);
            }
        }
    }
    end_time_disabler.disabled = false
}

function startTimeChanged(){
    if(start_time_selector.value !== -1){
        startTime = parseInt(start_time_selector.value);
        initializeEndHour()
    }
}

function endTimeChanged(){
    if(end_time_selector.value !== -1){
        endTime = parseInt(end_time_selector.value);
    }
}

function messageChanged(){
    if(message_input.value){
        message = message_input.value
    }
    else message = "void";
}

function show_error_message(message){
    const popupContainer = document.getElementById('popup-container');
    let popupText = document.getElementById("popup-text");
    popupText.textContent = message;
    popupContainer.style.display = 'flex';
}
function hide_error_message(){
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'none';
}




function reservation_clicked(){
    if(email && phone && date && table_id && startTime && endTime && message){
        searchUser().then((response)=>{
            if(response){ reserve(); }
            else createNewUser();
        })
    }
    else show_error_message(`No has terminado de rellenar todos los campos`)
}

function createNewUser(){
    if(email && phone && name && last_name){
        axios.get(`http://127.0.0.1:5000/api/v1/registerUser?name=${name}&last_name=${last_name}&email=${email}&phone=${phone}`)
            .then(response => {
                response = response.data
                if(response.id !== -1){
                    user_id = response.id
                    reserve();
                }
                else show_error_message("Ha ocurrido un error al registrar el usuario. Posiblemente la base de datos este saturada")
            })
            .catch(error => {
                console.error('Error:', error);
                show_error_message("Ha ocurrido un error al registrar el usuario")
            });
    }
    else show_error_message(`No has terminado de rellenar todos los campos`)
}

function getTimeByID(id){
    id = id.toString();
    for(i = 0; i <  hourList.length; i++){
        if(hourList[i].id === id){
            return `${hourList[i].hour}:${hourList[i].minute}`
        }
    }
    return "??:??"
}

function reserve(){
    if(date && table_id && startTime && endTime && user_id && message){
        console.log(startTime, endTime)
        axios.get(`http://127.0.0.1:5000/api/v1/reserve?user_id=${user_id}&date=${date}&table_id=${table_id}&start=${startTime}&end=${endTime}&message=${message}&email=${email}&phone=${phone}`)
            .then((response)=>{
                response = response.data
                response = response.response
                if(response === "already") show_error_message(`Ya se ha realizado una reserva para la fecha ${date}, la mensa ${table_id} a las ${getTimeByID(startTime)}`)
                else if(response) show_error_message("Su reserva se ha realizado satisfactoriamente. Revise su correo para más detalles")
                else  show_error_message("Ha ocurrido un error al realizar la reserva. Por favor, intente de nuevo mas tarde.")
            })
            .catch(error => {
                console.error('Error:', error);
                show_error_message("Ha ocurrido un error al realizar la reserva. Por favor, intente de nuevo mas tarde.")
            });
    }
    else show_error_message(`No has terminado de rellenar todos los campos`)
}