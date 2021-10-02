

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/


var superficie3D;
var mallaDeTriangulos;

var filas = 50;
var columnas = 50;
//Variables globales para las superficies parametricas
var superficieParametrica = "cilindro"; //esfera, plano
//cilindro
var amplitudCilindro = 0.1;
var longitudDeOndaCilindro = 8;
var alturaCilindro = 3;
var radioCilindro = 1;
//esfera
var radioEsfera = 1;
//plano
var anchoPlano = 3;
var largoPlano = 3;

function crearGeometria() {

    switch (superficieParametrica) {
        case "cilindro":
            menuInicial.showSubfolderCilindro();
            superficie3D = new tuboSenoidal(amplitudCilindro, longitudDeOndaCilindro, alturaCilindro, radioCilindro);
            break;
        case "esfera":
            menuInicial.showSubfolderEsfera();
            superficie3D = new Esfera(radioEsfera);
            break;
        case "plano":
            menuInicial.showSubfolderPlano();
            superficie3D = new Plano(anchoPlano, largoPlano);
            break;
        default:
            console.log("Superficie parametrica desconocida");
            break;
    }

    mallaDeTriangulos = generarSuperficie(superficie3D, filas, columnas);
}

function dibujarGeometria() {
    //console.log(superficieParametrica)
    crearGeometria();
    dibujarMalla(mallaDeTriangulos);
}
/*
 * Cilindro con pared senoidal
 * @param: amplitud, longitud de onda, altura y radio
 * --> La amplitud esta en la misma escala del radio y parte desde
 * donde termina el radio. Valor ideal de amplitud ->10%radio
 * --> Longitud de onda = 1 es el recorrido entre 2 crestas consecutivas, depende
 *                      de la cantidad de filas para poder observar todas las crestas
 * --> Altura del cilindro, alarga el cilindro, no modifica la longitud de onda
*/
function tuboSenoidal(amplitud, longitudDeOnda, altura, radio) {
    // rho = radio  , phi = [0, 2PI]

    this.getPosicion = function (u, v) {
        let phi = 2 * Math.PI * u;
        let rho = radio + amplitud * Math.cos(Math.PI * v * 2 * longitudDeOnda);
        let x = rho * Math.cos(phi);
        let z = rho * Math.sin(phi);
        let y = v * altura - 2; //se resta 2 para mejorar la visualizacion
        return [x, y, z];
    };
    //normal en cada vertice
    this.getNormal = function (u, v) {
        //calculo algebraico 

        
        return [1, 0, 0];
    };

    //se texturiza de manera aleatoria
    this.getCoordenadasTextura = function (u, v) {
        u = Math.PI * u;
        v = Math.PI * v / 4;
        return [Math.cos(v), Math.sin(v)];
    };

}

function Esfera(radio) {
    // u = [0, 2PI] .... v =[0, PI]
    this.getPosicion = function (u, v) {
        u = 2 * Math.PI * u;
        v = Math.PI * v;
        var y = radio * Math.sin(u) * Math.sin(v);
        var z = radio * Math.cos(u);
        var x = radio * Math.sin(u) * Math.cos(v);
        return [x, y, z];
    };
    //normal en cada vertice
    this.getNormal = function (u, v) {
        // Calculo que consume muchos recursos.
        // u = 2 * Math.PI * u;
        // v = Math.PI * v;
        // var coef = 1;//radio * radio * Math.sin(u);
        // var x_N = Math.cos(v) * Math.sin(u);
        // var y_N = Math.sin(u) * Math.sin(v);
        // var z_N = Math.cos(u);
        // return [coef * x_N, coef * y_N, coef * z_N];
        return [1, 0, 0];

    };

    //se texturiza de manera aleatoria
    this.getCoordenadasTextura = function (u, v) {
        u = Math.PI * u;
        v = 2 * Math.PI * v;
        return [-Math.sin(u) * Math.cos(v), Math.sin(u) * Math.sin(u)];
    };

}


function Plano(ancho, largo) {

    this.getPosicion = function (u, v) {

        var x = (u - 0.5) * ancho;
        var z = (v - 0.5) * largo;
        return [x, 0, z];
    };

    this.getNormal = function (u, v) {
        return [0, 1, 0];
    };

    this.getCoordenadasTextura = function (u, v) {
        return [v, u];
    };
}

function generarSuperficie(superficie, filas, columnas) {

    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i = 0; i <= filas; i++) {
        for (var j = 0; j <= columnas; j++) {

            var u = j / columnas;
            var v = i / filas;

            var pos = superficie.getPosicion(u, v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm = superficie.getNormal(u, v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs = superficie.getCoordenadasTextura(u, v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos

    //  (i,j) , (i, j+1) , (i+1, j+1), (i+1, j)
    verticesPorFila = columnas + 1;
    indexBuffer = new Array;

    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas + 1; j = j + 2) {
            indexBuffer.push(i * verticesPorFila + j);
            indexBuffer.push((i + 1) * verticesPorFila + j);
            indexBuffer.push(i * verticesPorFila + j + 1);
            indexBuffer.push((i + 1) * verticesPorFila + j + 1);
        }
        l = indexBuffer.length;
        if (!(columnas % 2)) { //se corrige las dos ultimas posiciones antes de ir a la sig fila
            //si columnas es par
            indexBuffer[l - 1] = indexBuffer[l - 2];
            indexBuffer[l - 2] = indexBuffer[l - 3];
        } else { //si columnas es impar se agrega dos indices antes de continuar
            indexBuffer.push(indexBuffer[l - 1]);
            indexBuffer.push((i + 1) * verticesPorFila + 0); //el sig indice es 
            //la iteracion con i+1 y con j=0.
        }
    }
    indexBuffer.pop(); indexBuffer.pop(); //las dos ultimas pos son innecesarias ya que no quedan filas 

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    };
}

function dibujarMalla(mallaDeTriangulos) {

    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo != "wireframe") {
        gl.uniform1i(shaderProgram.useLightingUniform, (lighting == "true"));
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        //gl.TRIANGLES
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    if (modo != "smooth") {

        gl.uniform1i(shaderProgram.useLightingUniform, false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

}

