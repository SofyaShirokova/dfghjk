const columnNames = ['Город', 'Пострадавшие','Марка машины']
const city = ['Москва','Уссурийск','Новокузнецк','Ульяновск','Магадан','Воронеж','Сочи','Пенза','Санкт-Петербург','Санкт-Петербург','Владивосток','Владивосток','Владивосток','Владивосток','Владивосток','Калининград','Хабаровск','Хабаровск','Петрозаводск','Петрозаводск','Тула','Тула','Брянск','Брянск','Орёл','Орёл','Челябинск','Челябинск','Уфа','Уфа','Кострома','Кострома','Калуга','Калуга','Геленджик','Геленджик','Иркутск','Иркутск','Москва','Уссурийск','Новокузнецк','Ульяновск','Магадан','Воронеж','Сочи','Находка','Находка','Воронеж','Москва','Владивосток']
const injured = [2,0,0,3,5,12,0,2,6,4,0,3,1,2,1,0,1,4,2,3,5,6,5,0,0,2,0,0,3,5,12,0,2,6,4,0,3,1,2,1,0,1,4,2,3,5,6,5,0,0]
const marka = ['CITROEN','AUDI','BMW','AUDI','HONDA','HONDA','HYUNDAI','MAZDA','LEXUS','MERCEDES','TOYOTA','SUBARU','SUBARU','HYUNDAI','HONDA','AUDI','HONDA','HYUNDAI','MAZDA','CITROEN','LEXUS','BMW','MERCEDES','AUDI','CHEVROLET','FIAT','FIAT','KIA','MAYBACH','MAZDA','LAMBORGHINI','LEXUS','DAIHATSU','CITROEN','CHERY','CADILLAC','BMW','MAZDA','LAMBORGHINI','MAZDA','PEUGEOT','OPEL','PEUGEOT','NISSAN','MITSUBISHI','RENAULT','PEUGEOT','MASERATI','ROLLS-ROYCE','SUBARU']

let DTP = {
    City: [...city],
    Injured: [...injured],
    Marka:[...marka],

    getAllKey: function () {
        let arrKey = [];
        for(let key in this) {
            if (typeof(this[key]) !== 'function') {
                arrKey.push(key)
            }
        }
        return arrKey;
    },

    print: function() {
        let html = '<table><tr>';
        let arrKey = this.getAllKey();
        for(let key in columnNames) {
            html += `<th>${ columnNames[key] }</th>`;
        }
        html += '</tr>';
        for(let i = 0; i < this[arrKey[0]].length; i++) {
            html += '<tr>';
            for(let key in arrKey) {
                html += `<td>${ this[arrKey[key]][i] }</td>`;
            }
            html += '</tr>';
        }
        return html + '</table>';
    }
};

let updatedDTP = {
    __proto__: DTP,
    //перестановка элементов таблицы
    change: function(k, p) {
        let allKey = this.getAllKey();
        for(let key in allKey) {
            let w = this[allKey[key]][k];
            this[allKey[key]][k] = this[allKey[key]][p];
            this[allKey[key]][p] = w;
        }
    },
    //проверка нужно ли переставлять местами элементы таблицы
    doCompare: function(elem1, elem2, sortOrder){
        switch (sortOrder)
        {
            case 'asc':
                return elem1 > elem2;
            case 'desc':
                return elem1 < elem2;
        }
    },
    // возвращает true, если элементы менять местами надо, false - в противном случае
    isCompareOrder: function(n, arrCompare) {
        for(let k = 0; k < arrCompare.length; k += 2) { // цикл по длине значений массива ("поле""порядок""поле""порядок")
            let sortOrder = (arrCompare[k+1] === true)? 'desc' : 'asc'; // В каком порядке сторону сортируем
            if (this.doCompare(this[arrCompare[k]][n], this[arrCompare[k]][n + 1], sortOrder)) { //если текущее значение функции doCompare=true(сравнивает текущий рассматриваемый элемент и следующий),
                return true;                                                                     //то элементы требуют перестановки
            } else if (this[arrCompare[k]][n] === this[arrCompare[k]][n + 1]) {                  //если текущий и следующий элемент равны,
                continue;                                                                        //мы их пропускаем
            } else {                                                                             //иначе, возвращаем false элементы не меняем местами
                return false;
            }
        }
        return false
    },
    //бабл
    sorted: function(arr) {
        let n = this[arr[0]].length;
        for(let i = 0; i < n - 1; i += 1) {
            for (let j = 0; j < n - i - 1; j++) {
                if (this.isCompareOrder(j, arr)) {
                    this.change(j, j + 1); //перестановка элементов местами
                }
            }
        }
        return true;
    },
    //
    getResultLogOpr: function(valueLeft, opr, valueRight) {
        if (opr === '==') {
            return valueLeft.indexOf(valueRight) !== -1; //поиск значения в строке
        }
        if (opr === '!=') {
            return valueLeft !== valueRight;
        }
        if (opr === '>') {
            return valueLeft > valueRight;
        }
        if (opr === '<') {
            return valueLeft < valueRight;
        }
        if (opr === '>=') {
            return valueLeft >= valueRight;
        }
        if (opr === '<=') {
            return valueLeft <= valueRight;
        }
    },

    filtered: function(arr) {
        if (arr.length === 0) return;
        let indexTrue = [];
        for (let i in this[arr[0]["key"]])
            indexTrue.push(+i);
        for (let i in arr) {
            let arrTrue = [];
            for (let j = 0; j < this[arr[i]["key"]].length; j++) {
                if (this.getResultLogOpr(this[arr[i]["key"]][j],arr[i]["operation"],arr[i]["value"])){
                    arrTrue.push(j);
                }
            }
            indexTrue = arrIntersection(indexTrue, arrTrue); //массив меняется на результаты
        }
        let curKeys = this.getAllKey();
        for (let k in curKeys) {
            let newValue = [];
            for (let i in indexTrue) {
                newValue.push(this[curKeys[k]][indexTrue[i]]);
            }
            this[curKeys[k]] = newValue;
        }
    },

    setToDefault: function() { //возвращение к начальным значениям
        this.City = [...city];
        this.Injured = [...injured];
        this.Marka = [...marka];
    }
};

function arrIntersection (arr1, arr2) {
    let result = [];
    for(let i in arr1)
    {
        if(arr2.includes(arr1[i])) result.push(arr1[i]); //проверка на то, есть ли элемент и запушивает его
    }
    return result;
}

let options = {
    No: 'Нет',
    City: 'Город',
    Injured: 'Пострадавшие',
    Marka: 'Марка'
}

let arrOptions = [];
for (let key in options) {
    let newOption = document.createElement('option');
    let optionText = document.createTextNode(options[key]);
    newOption.appendChild(optionText);
    newOption.setAttribute('value', key);
    arrOptions.push(newOption);
}

drawTable = () => document.getElementById('table').innerHTML = updatedDTP.print();

function sortButton(){
    let arr = [];
    for (let i = 1; i < 3; i++) {
        if (document.getElementById(`selectLevel${i}`).value !== 'No') {
            arr.push(document.getElementById(`selectLevel${i}`).value);
            arr.push(document.getElementById(`sortOrder${i}`).checked);
        }
    }
    updatedDTP.sorted(arr);
    drawTable();
}

function filterButton(){
    let arr = [];
    if (document.getElementById("CityFilter").value !== "") {
        let object = {
            key: "City",
            operation: "==",
            value: document.getElementById("CityFilter").value
        }
        arr.push(object);
    }
    if (document.getElementById("InjuredFilter1").value !== "") {
        let object1 = {
            key: "Injured",
            operation: ">=",
            value: +document.getElementById("InjuredFilter1").value
        }
        arr.push(object1);

    }
    if (document.getElementById("InjuredFilter2").value !== "") {
        let object2 = {
            key: "Injured",
            operation: "<=",
            value: +document.getElementById("InjuredFilter2").value
        }
        arr.push(object2);
    }

    if (document.getElementById("MarkaFilter").value !== "") {
        let object = {
            key: "Marka",
            operation: "==",
            value: document.getElementById("MarkaFilter").value
        }
        arr.push(object);
    }
    updatedDTP.filtered(arr);
    drawTable();
}

function resetButton(){ //сброс таблицы
    updatedDTP.setToDefault();
    drawTable();
}

function getActualOptions() { //проверка на то, сколько пунктов в списке выводить
    for (let count = 1; count < 3; count++) {
        addOptionsToSelect(count);
    }
    for (let count = 1; count < 3; count++) {
        removeOptions(count);
    }
}

function addOptionsToSelect(count){ //добавление выпадающих пунктов
    for (let i = 0; i < arrOptions.length; i++) {
        let flag = true;
        for (let j = 0; j < document.getElementById(`selectLevel${count}`).options.length; j++) {
            if (document.getElementById(`selectLevel${count}`).options[j].value === arrOptions[i].value) {
                flag = false;
                break;
            }
        }
        if (flag)
            document.getElementById(`selectLevel${count}`)
                .insertBefore(
                    arrOptions[i].cloneNode(true),
                    document.getElementById(`selectLevel${count}`).options[i]
                );
    }
}

function removeOptions(count){ //Удаление выпадающих пунктов
    let index = 0;
    while (index < document.getElementById(`selectLevel${count}`).length) {
        for (let i = 1; i < 3; i++) {
            if (i === count) continue;
            if (document.getElementById(`selectLevel${count}`).options[index].value === document.getElementById(`selectLevel${i}`).value
                && document.getElementById(`selectLevel${i}`).value !== "No") {
                document.getElementById(`selectLevel${count}`).options[index] = null;
                index = 0;
            }
        }
        index++;
    }
}