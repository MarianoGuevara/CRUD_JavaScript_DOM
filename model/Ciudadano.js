import { Persona }  from '../model/Persona.js';

class Ciudadano extends Persona
{
    dni;

    constructor(nombre,apellido,fechaNacimiento,dni,id=null)
    {
        super(nombre,apellido,fechaNacimiento,id);
        this.dni = super.ValidarNum(dni, 0, "Dni invalido o negativo");
    }

    toString(){return JSON.stringify(this);}

    Equals(p)
    {
        return (super.Equals(p) && this["dni"] == p["dni"]);
    }
}
export { Ciudadano };