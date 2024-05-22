import { Persona }  from '../model/Persona.js';

class Extranjero extends Persona
{
    paisOrigen;

    constructor(nombre,apellido,fechaNacimiento,paisOrigen,id=null)
    {
        super(nombre,apellido,fechaNacimiento,id);

        this.paisOrigen = super.ValidarString(paisOrigen, 2, "pais de origen invalido o negativo");
    }

    toString(){return JSON.stringify(this);}

    Equals(p)
    {
        return (super.Equals(p) && this["paisOrigen"] == p["paisOrigen"]);
    }
}
export { Extranjero };