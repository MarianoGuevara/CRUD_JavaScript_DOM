import {Ciudadano} from "../model/Ciudadano.js"; // importar todo desde perspectiva de HTML.
import {Extranjero} from "../model/Extranjero.js"; 
console.log("olsssss");
//#region De un tipo a otro
function StringToArrayObjeto(arrayString) { return JSON.parse(arrayString);}

function FromObjectToClass(obj)
{
    let retorno;
    if (obj["dni"] == undefined)
    {
        retorno = new Extranjero(obj["nombre"], obj["apellido"],
        obj["fechaNacimiento"], obj["paisOrigen"], obj["id"],
        )
    }
    else
    {
        retorno = new Ciudadano(obj["nombre"], obj["apellido"],
        obj["fechaNacimiento"], obj["dni"], obj["id"],
        )
    }
    return retorno;
}

function FromObjectArrayToClassArray(arrayObject)
{
    try
    {
        let arrayFinal = [];
        for (let i=0; i<arrayObject.length; i++)
        {
            let objeto = FromObjectToClass(arrayObject[i]);
            arrayFinal.push(objeto);
        }
        return arrayFinal;
    }
    catch (e) {throw e;}
}

function ArrayValuesDeObjeto(objeto)
{
    let lista = [objeto["id"], objeto["nombre"], objeto["apellido"], objeto["fechaNacimiento"]];

    if (objeto["dni"] != undefined)
    {
        lista.push(objeto["dni"]);
        lista.push(null);
    }
    else
    {
        lista.push(null);
        lista.push(objeto["paisOrigen"]);
    }
    return lista;
}

//#endregion

//#region llamar y manipular objetos html

function DesactivarActivarDisplay(desactivar, etiqueta)
{
    if (desactivar) etiqueta.style.display = "none";
    else etiqueta.style.display = "";
}

function ExtraerObjetoID(idString) { return document.getElementById(idString); }

function EliminarObjeto(objetoPadre, objetoHijo) 
{
    let hijoEliminado = objetoHijo;
    objetoPadre.removeChild(objetoHijo);
    return hijoEliminado;
}

function AppendearObjeto(objetoPadre, objetoHijo) {objetoPadre.appendChild(objetoHijo);}

//#endregion

//#region manipular tabla y valores de la misma

function StringSegunDosObjetos(objeto, valor1, valor2, clase1, clase2)
{
    let strRetorno = "";
    if (objeto instanceof clase1) strRetorno = valor1;
    else if (objeto instanceof clase2) strRetorno = valor2;
    return strRetorno;
}

function ListaClasesTr(arrayObjetosFinal)
{
    let clasesTr = [];
    for (let i=0; i<arrayObjetosFinal.length; i++)
    {
        clasesTr.push(StringSegunDosObjetos(arrayObjetosFinal[i], "ciudadano", "extranjero", Ciudadano, Extranjero));
    }
    return clasesTr;
}

function FiltrarTablaPorTipos()
{
    arrayObjetosFinalCopia = arrayObjetosFinal.slice();
    let arrayObjetosFiltrada = FiltrarArrayObjetos(arrayObjetosFinalCopia, ExtraerObjetoID("miSelect").value);

    let arrayClasesTr = ListaClasesTr(arrayObjetosFiltrada);

    BorrarFilasTabla();
    DibujarFilasTabla(arrayObjetosFiltrada, arrayClasesTr, arrayColumnasTabla, document.getElementsByClassName("tablaEntera")[0]);
}

function FiltrarArrayObjetos(arrayObjetos, strTipo)
{
    let arrayFinal = [];
    for (let i=0; i<arrayObjetos.length; i++)
    {
        if (strTipo == "ciudadanos" && arrayObjetos[i] instanceof Ciudadano) arrayFinal.push(arrayObjetos[i]);
        else if (strTipo == "extranjeros" && arrayObjetos[i] instanceof Extranjero) arrayFinal.push(arrayObjetos[i]);
        else if (strTipo == "todos")
        {
            arrayFinal = arrayObjetos;
            break;
        }
    }
    arrayObjetosFinalCopia = arrayFinal.slice();
    return arrayFinal;
}

function BorrarFilasTabla()
{
    let tabla = document.getElementsByClassName("tablaEntera")[0].querySelectorAll("tr")
    tabla.forEach(element =>
    {
        if(element.classList[0] != "encabezado")
        {
            document.getElementsByClassName("tablaEntera")[0].removeChild(element);
        }
    })
}

function PromediarEdadesTabla(actualYear)
{
    let arrayObjetosFiltrada = FiltrarArrayObjetos(arrayObjetosFinal, ExtraerObjetoID("miSelect").value);
    let promedio = CalcularPromedio(arrayObjetosFiltrada, "fechaNacimiento", actualYear);
    ExtraerObjetoID("promedio").value = promedio;
}

function CalcularPromedio(lista, keyCalcular, actualYear)
{
    let retorno = 0
    try
    {

        let acumulador = lista.reduce((valorTotal, elementoActual, indice, vector) => 
        {
            let arrayDate = elementoActual.StringToDateArray(elementoActual[keyCalcular]);
            let years = parseInt(arrayDate[0]);
            years = actualYear - years
            return valorTotal += years;},0)

        console.log(acumulador)
        // console.log(suma)
        retorno = acumulador / lista.length;
    }
    catch { retorno = null};
    return retorno;
}

//#endregion


//#region crear objetos html

function ActivarDesactivarColumna(desactivar, tablaClase, classToModify)
{
    let tabla = document.getElementsByClassName(tablaClase);
    tabla = tabla[0];

    tabla.querySelectorAll("tr").forEach(element => {
        element.querySelectorAll("td").forEach(element2 => {
            if (element2.classList[1] == classToModify) DesactivarActivarDisplay(desactivar, element2);
        });
    });
}

function CreacionDeCheckboxes(divPadre, cantCheckBoxes, arrayTextos, tablaClase)
{
    for (let i=0; i<cantCheckBoxes; i++) 
    {
        let checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", arrayTextos[i]+"Ch");
        checkBox.checked = true;

        let label = document.createElement("label");
        label.appendChild(document.createTextNode(arrayTextos[i]));

        divPadre.appendChild(label);
        divPadre.appendChild(checkBox);

        checkBox.addEventListener("click",  
        function(){ActivarDesactivarColumna(!checkBox.checked, tablaClase, arrayTextos[i]);});
        listaCheckBoxes.push(checkBox);
    }
}


function CrearTabla(stringIdPadreTabla, arrayColumnas, arrayObjetos, clasesTr=null)
{
    let tabla = CrearElementoHtml("table", "tablaEntera", "", false);

    let arrayColumnasMapeado = arrayColumnas.map(function(element){return element + " encabezadoTd";})
    let encabezado = CrearFilaTabla("encabezado", arrayColumnas, arrayColumnasMapeado);
    tabla.appendChild(encabezado);

    DibujarFilasTabla(arrayObjetos, clasesTr, arrayColumnas, tabla);
}

function CrearFilaTabla(claseTr, listaValores, arrayClasesTd=null)
{
    let tr = CrearElementoHtml("tr", claseTr, "", false);

    for (let i=0; i<listaValores.length; i++)
    {
        let casillaTd = CrearElementoHtml("td", "tdTabla " + arrayClasesTd[i], listaValores[i]);
        tr.appendChild(casillaTd);

        DesactivarActivarDisplay(!listaCheckBoxes[i].checked, casillaTd);
    }
    return tr;
}

function DibujarFilasTabla(arrayObjetos, clasesTr, arrayColumnas, tablaObjeto)
{
    for (let i=0; i<arrayObjetos.length; i++)
    {
        let listaValoresActual = ArrayValuesDeObjeto(arrayObjetos[i]);

        let fila;
        if (clasesTr == null) fila = CrearFilaTabla("", listaValoresActual, arrayColumnas);
        else fila = CrearFilaTabla(clasesTr[i], listaValoresActual, arrayColumnas);

        tablaObjeto.appendChild(fila);

        fila.addEventListener("dblclick",function(){EditarABM(fila);})
    }

    console.log(arrayObjetosFinal);
    console.log(arrayObjetosFinalCopia);

    ExtraerObjetoID("contenedorTabla").appendChild(tablaObjeto);
}

function CrearElementoHtml(tipoEtiqueta, nombreClase, valorTexto, conTexto=true)
{
    let etiqueta = document.createElement(tipoEtiqueta); 
    etiqueta.setAttribute("class", nombreClase);

    if (conTexto)
    {
        let hijo = document.createTextNode(valorTexto);
        etiqueta.appendChild(hijo);
    }

    return etiqueta;
}

function AsignarOrdenamientosToEncabezados()
{
    let encabezado = document.getElementsByClassName("encabezado")[0];
    encabezado.querySelectorAll("td").forEach(element => {
        element.addEventListener("click", function(){OrdenarTabla(arrayObjetosFinalCopia, element.textContent)})
    })
}

function OrdenarTabla(arrayOrdenar, keyToOrder)
{
    let auxA;
    let auxB;

    arrayOrdenar.sort((a,b) => 
    {
        auxA = a[keyToOrder];
        auxB = b[keyToOrder];
        if (a[keyToOrder] == undefined)
        {
            if (keyToOrder == "paisOrigen") auxA = "abc";
            else if (keyToOrder == "dni") auxA = 0;
        }
        else if (b[keyToOrder] == undefined)
        {
            if (keyToOrder == "paisOrigen") auxB = "abc";
            else if (keyToOrder == "dni") auxB = 0;
        } // PARA QUE LOS NULL SIEMPRE ME QUEDEN TDS JUNTOS.

        if (auxA>auxB) 
        {
            return 1;
        }
        else if (auxA<auxB) 
        {
            return -1;
        }
    });

    console.log(arrayOrdenar);
    ActualizarTabla();
}

function ActualizarTabla()
{
    BorrarFilasTabla();
    let clasesTr = ListaClasesTr(arrayObjetosFinalCopia);
    DibujarFilasTabla(arrayObjetosFinalCopia, clasesTr, arrayColumnasTabla, document.getElementsByClassName("tablaEntera")[0]);
}

function AceptarTabla()
{
    ActivarDesactivarForms(false);
    ExtraerObjetoID("AceptarABM").textContent = "Agregar";
    LimpiarInputsAMB()
    GenerarBtnEliminarABM(true);
}

function ActivarDesactivarForms(tablaActivar, editar=false, indiceIgualdad=null)
{
    let padre = ExtraerObjetoID("padreDeContenedor");
    let hijoBorrar;
    let hijoAgregar;

    if (tablaActivar == false)
    {
        hijoBorrar = tablaActualTotal;
        hijoAgregar = formABMActualTotal;
    }
    else
    {
        hijoBorrar = formABMActualTotal;
        hijoAgregar = tablaActualTotal;
    }

    EliminarObjeto(padre, hijoBorrar);
    padre.appendChild(hijoAgregar);

    if (editar)
    {
        formABMActualTotal.setAttribute("class", "editar" + " " + indiceIgualdad);
        ExtraerObjetoID("AceptarABM").textContent = "Modificar";
    } 
    else if (formABMActualTotal.classList[0] == "editar")
    {
        formABMActualTotal.classList.remove("editar");
        formABMActualTotal.classList.remove(indiceIgualdad);
    }

    if (ExtraerObjetoID("miSelect") != null) FiltrarTablaPorTipos(); 
}

function LimpiarInputsAMB()
{
    let arrayABM = [ExtraerObjetoID("ABMid"), ExtraerObjetoID("ABMnombre"),
                    ExtraerObjetoID("ABMapellido"),ExtraerObjetoID("ABMfechaNacimiento"),
                    ExtraerObjetoID("ABMatr1"), ExtraerObjetoID("miSelectABM")]
    arrayABM.forEach(element => {
        element.value = "";
    });
    ExtraerObjetoID("miSelectABM").value = "cliente";
}

function CambiarLabelAtr()
{
    let slider = ExtraerObjetoID("miSelectABM");
    let lblAtr1 = document.getElementsByClassName("labelAtr")[0];
    if (slider.value == "ciudadano") lblAtr1.textContent = "Dni";
    else lblAtr1.textContent = "Pais de origen";
}

function GenerarBtnEliminarABM(eliminar=false)
{
    let contenedor = document.getElementsByClassName("BotonesABM")[0]
    if (eliminar)
    {
        if (contenedor.querySelectorAll("button").length > 2)
        {
            let btn = document.getElementsByClassName("eliminarABM")[0];
            contenedor.removeChild(btn);
        }
    }
    else
    {
        if(contenedor.querySelectorAll("button").length < 3)
        {
            let btn = CrearElementoHtml("button", "eliminarABM", "Eliminar");
            contenedor.appendChild(btn);
            btn.addEventListener("click", EliminarObjetoABM);
        }
    }
}

//#endregion

//#region AMB

function AgregarObjeto()
{
    try
    {   
        let arrayABM = [ExtraerObjetoID("ABMid"), ExtraerObjetoID("ABMnombre"),
                    ExtraerObjetoID("ABMapellido"),ExtraerObjetoID("ABMfechaNacimiento"),
                    ExtraerObjetoID("ABMatr1"), ExtraerObjetoID("miSelectABM")];

        let objeto;
        if (ExtraerObjetoID("miSelectABM").value == "ciudadano")
        {
            objeto = new Ciudadano(arrayABM[1].value, arrayABM[2].value, arrayABM[3].value, arrayABM[4].value);
        }
        else
        {
            objeto = new Extranjero(arrayABM[1].value, arrayABM[2].value, arrayABM[3].value, arrayABM[4].value);
        }

        if (ExtraerObjetoID("contenedor2").classList[0] == "editar")
        {
            let i = ExtraerObjetoID("contenedor2").classList[1];
            let idAux = ExtraerObjetoID("ABMid").value;
            arrayObjetosFinal[i] = objeto;
            arrayObjetosFinal[i].id = parseInt(idAux);
        }
        else 
        {
            arrayObjetosFinal.push(objeto);
        }
    }
    catch (e) {alert(e.message);}

    arrayObjetosFinalCopia = arrayObjetosFinal.slice();
    ActivarDesactivarForms(true);
    ActualizarTabla();
}

function EditarABM(filaTr)
{
    let indiceIgualdad = NexoPersonaConObjABM(filaTr);
    ActivarDesactivarForms(false, true, indiceIgualdad);
    GenerarBtnEliminarABM();
}

function NexoPersonaConObjABM(filaTr)
{
    let indiceIgual = -1;
    let objeto = AbmCrearMostrarObjeto(filaTr);

    for (let i=0; i<arrayObjetosFinal.length; i++)
    {
        if (arrayObjetosFinal[i].Equals(objeto))
        {
            indiceIgual = i;
            break;
        }
        // pq esto es JS no necesito parsear los string de 'objeto'
        // 2 == "2"... raro pero es así
    }
    return indiceIgual;
}

function AbmCrearMostrarObjeto(filaTr)
{
    ActivarDesactivarForms(false);
    let indice = 0;
    let arrayTd = filaTr.querySelectorAll("td");

    let arrayABM = [ExtraerObjetoID("ABMid"), ExtraerObjetoID("ABMnombre"),
                    ExtraerObjetoID("ABMapellido"),ExtraerObjetoID("ABMfechaNacimiento"),
                    ExtraerObjetoID("ABMatr1"), ExtraerObjetoID("miSelectABM")];

    let obj = {};
    arrayTd.forEach(element => {
        if (element.textContent != "null")
        {
            arrayABM[indice].value = element.textContent;
            obj[element.classList[1]] = element.textContent;
            indice ++;
        }
    });

    if (obj["paisOrigen"] == undefined) arrayABM[arrayABM.length-1].value = "ciudadano";
    else arrayABM[arrayABM.length-1].value = "extranjero";
    CambiarLabelAtr();

    ActivarDesactivarForms(true);
    return obj;
}

function EliminarObjetoABM()
{
    let indice = ExtraerObjetoID("contenedor2").classList[1]
    arrayObjetosFinal[indice]
    arrayObjetosFinal.splice(indice, 1);
    arrayObjetosFinalCopia = arrayObjetosFinal.slice();
    ActivarDesactivarForms(true);
    ActualizarTabla();
}

//#endregion

//#region Declaración real de variables. Ejecución de codigo secuencial (arriba a abajo)
let setDatosString = '[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas",\
"nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta",\
"fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,\
"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},\
\{"id":666,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]';

var tablaActualTotal;
var formABMActualTotal;

let arrayObjetosGenerico = StringToArrayObjeto(setDatosString);
try
{
    var arrayObjetosFinal = FromObjectArrayToClassArray(arrayObjetosGenerico);
    var arrayObjetosFinalCopia = arrayObjetosFinal.slice(); // copia independiente
    var listaCheckBoxes = [];
    var arrayColumnasTabla = ["id", "nombre", "apellido", "fechaNacimiento", "dni", "paisOrigen"];

    let clasesTr = ListaClasesTr(arrayObjetosFinal);

    CreacionDeCheckboxes(document.getElementsByClassName("checkboxs")[0], arrayColumnasTabla.length, arrayColumnasTabla, "tablaEntera");

    CrearTabla("contenedorTabla", arrayColumnasTabla, arrayObjetosFinal, clasesTr);
    AsignarOrdenamientosToEncabezados();

    tablaActualTotal = ExtraerObjetoID("contenedor"); 
}
catch (e) {alert(e.message);}

formABMActualTotal = EliminarObjeto(ExtraerObjetoID("padreDeContenedor"), ExtraerObjetoID("contenedor2"));

//#endregion
// export { Mai };