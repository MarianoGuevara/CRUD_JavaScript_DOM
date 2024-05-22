class Persona
{
    static #listaId = [];
    id;
    nombre;
    apellido;
    fechaNacimiento;

    constructor(nombre,apellido,fechaNacimiento,id=null)
    {
        try
        {
            console.log("sisi");
            if (id == null) this.id = this.SetearIdUnico(10, Persona.#listaId); 
            else this.id = this.ValidarId(id, "Id invalido o no único");
            this.nombre = this.ValidarString(nombre, 2, "Nombre menor a 2 caracteres o incorrecto");
            this.apellido = this.ValidarString(apellido, 2, "Apellido menor a 2 caracteres o incorrecto");

            this.fechaNacimiento = this.ArrayStringToValidDate(this.StringToDateArray(fechaNacimiento),
                                            2025, 13, 32, "Fecha inválida");
            
        }
        catch (e) {throw e};

        Persona.#listaId.push(this.id);
    }

    ArrayStringToValidDate(array, maxYear, maxMonth, maxDay, errorMsg)
    {
        for (let i=0; i<array.length; i++)
        {
            if (isNaN(array[i]) || array[i] < 1) throw new Error(errorMsg);
        }
        let boolYear = array[0] < maxYear;
        let boolMonth = array[1] < maxMonth;
        let boolDay = array[2] < maxDay;
        let fechaValida = array[0] + array[1] + array[2]; // juego con que se puede comparar str con int y concatenar str  por eso no parseo nunca hasta el retorno...

        if (boolYear && boolMonth && boolDay) return parseInt(fechaValida);
        else throw new Error(errorMsg);  
    }

    StringToDateArray(str)
    {
        str = str.toString();
        let year = "";
        let month = "";
        let day = "";
        for (let i=0; i<str.length; i++)
        {
            if (year.length != 4) year += str[i];
            else if (month.length != 2) month += str[i];
            else if (day.length != 2) day += str[i];
            else break;
        }
        let array = [year, month, day];
        return array;
    }

    ValidarString(valor, minimo, msjError) 
    {
        if (this.VerificarNuloNum(valor) || !isNaN(valor) || valor.length < minimo) throw new Error(msjError);
        else return valor;
    }

    ValidarNum(valor, minimo, msjError) 
    {
        if (isNaN(valor) || this.VerificarNuloNum(valor, true, parseFloat(minimo)) ) throw new Error(msjError);
        else return parseFloat(valor);
    }

    ValidarId(valor, msjError)
    {
        if (isNaN(valor) || !this.VerificarIdUnico(Persona.#listaId, valor)) throw new Error(msjError);
        else return parseInt(valor);
    }

    VerificarIdUnico(array, id)
    {
        let retorno = true;
        let nuevoArray = array.map(function(element){return element == id;})
        for(let i=0; i<array.length; i++)
        {
            if (nuevoArray[i] == true) 
            {
                retorno = false;
                break;
            }
        }
        return retorno;
    }

    SetearIdUnico(maximo, array)
    {
        let numId = Math.round(Math.random() * maximo)
        let unico = this.VerificarIdUnico(array, numId)
        if (!unico) return this.SetearIdUnico(maximo+=10, array);
        else return numId;
    }

    VerificarNuloNum(valor, mayorNum=null, minimo=null)
    {
        if (mayorNum == null) return (valor == null);
        else return (valor == null || valor <= minimo);
    }

    Equals(p)
    {
        return (this["id"] == p["id"] && this["nombre"] == p["nombre"] && this["apellido"] == p["apellido"]);
    }
}
export { Persona };