//Deprecated. Previously, hours were loaded before tables
function loadTimes(){
    if(hourList.length === 0){
        axios.get(`http://127.0.0.1:5000/api/v1/hours`)
            .then(response => {
                response = response.data;
                for (let i = 0; i < response.length; i++){
                    if(response[i].id && response[i].hour && response[i].minute){
                        hourList.push({hour: response[i].hour,minute: response[i].minute, id: response[i].id})
                    }
                }
                initializeStartHour();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else{
        console.log("Cargando de RAM: ", hourList)
    }
}

function oldInitializeStartHour(){
    start_time_selector.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '-1';
    defaultOption.textContent = 'Hora Inicio';
    start_time_selector.appendChild(defaultOption);
    for (let i = 0; i < hourList.length - 1; i++) {
        let newOption = document.createElement('option');
        newOption.value = hourList[i].id;
        newOption.textContent = `${hourList[i].hour}:${hourList[i].minute}`
        start_time_selector.appendChild(newOption);
    }
}


function oldChangeEndHourRange(){
    end_time_selector.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '-1';
    defaultOption.textContent = 'Hora Fin';
    end_time_selector.appendChild(defaultOption);
    for (let i = 0; i < hourList.length; i++) {
        if(hourList[i].id > startTime){
            let newOption = document.createElement('option');
            newOption.value = hourList[i].id;
            newOption.textContent = `${hourList[i].hour}:${hourList[i].minute}`
            end_time_selector.appendChild(newOption);
        }
    }
}

function startTimeChanged(){
    if (start_time_selector.value !== -1) {
        startTime = Number(start_time_selector.value);
        if(end_time_selector.disabled) end_time_selector.disabled = false;
        changeEndHourRange();
    } else {
        end_time_selector.disabled = true;
    }
}

function endTimeChanged(){
    if (end_time_selector.value !== -1) {
        endTime = Number(end_time_selector.value);
    }
}

function reservation_clicked(){    //Valida que todos los componentes pudieran jalarse de HTML:
    if (!(start_time_selector && end_time_selector && date && tables_selector && phone_input && email && name)) {
        show_error_message("Error: Los elementos de HTML no cargaron correctamente... Muy sospechoso...")
        return;
    }
    //Valida los datos:
    let data = {
        "name": name.value,
        "last_name": last_name.value,
        "email": email.value,
        "phone": phone.value,
        "numberGuests": numberGuests.value,
        "date": date.value,
        "start": start.value,
        "end": end.value,
    };
    if(!validate_name(data.name, 3, 50)) return;
    if(!validate_name(data.last_name, 3, 50)) return;
    if(!validate_mail(data.email), 5, 50) return;
    if(!validate_phone(data.phone)) return;
    if(data.start === -1){
        show_error_message("No ha elegido una hora de inicio")
        return;
    }
    if(data.end === -1){
        show_error_message("No ha elegido una hora de finalizacion")
        return;
    }
    console.log(data)
    axios.get(`http://127.0.0.1:5000/api/v1/greet?name=${data}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}