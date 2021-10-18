
        // atributos del vértice (cada uno se alimenta de un ARRAY_BUFFER distinto)
        //ej: 10 vertices --> 30 valores en el array de posiciones y normales
        //    y 20 valores en el array de Uv, la cuenta es 10*(2 posiciones de uv ) --> 20
        attribute vec3 aPosition;   //posicion (x,y,z)
        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1

        // Cada nucleo de la GPU se encarga de distintos attribute diferentes al mismo tiempo
        // pero todos lo nucleos pueden ver al uniform
        
        // variables Uniform (son globales a todos los vértices y de solo-lectura)
        // Es un solo valor en memoria compartido por TODOS los nucleos de la GPU

        uniform mat4 uMMatrix;     // matriz de modelado
        uniform mat4 uVMatrix;     // matriz de vista
        uniform mat4 uPMatrix;     // matriz de proyección
        uniform mat3 uNMatrix;     // matriz de normales
                        
        uniform float time;                 // tiempo en segundos
        
        uniform sampler2D uSampler;         // sampler de textura de la tierra

        /*
         * Logica del Vertex Shader--> recibe un vertice y devuelve un vertice modificado
         *
         * variables varying (comunican valores entre el vertex-shader y el fragment-shader)
         * Es importante remarcar que no hay una relacion 1 a 1 entre un programa de vertices y uno de fragmentos
         * ya que por ejemplo 1 triangulo puede generar millones de pixeles (dependiendo de su tamaño en pantalla)
         * por cada vertice se genera un valor de salida en cada varying.
         * Luego cada programa de fragmentos recibe un valor interpolado de cada varying en funcion de la distancia
         * del pixel a cada uno de los 3 vértices. Se realiza un promedio ponderado
         */
        //Salidas del programa, vertices modificado
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;                           
        
        // constantes
        
        const float PI=3.141592653;

        //Aplicamos a cada vertice transformaciones de matrices
        void main(void) {
            //Entran 3 valores de atributos, los ponermos en variables para poder modifcarlos
            vec3 position = aPosition;		//puntos de la esfera  centrada en 0 y de radio 1
            vec3 normal = aNormal;	
            vec2 uv = aUv;
            //Leemos el color de la textura                	
            vec4 textureColor = texture2D(uSampler, vec2(uv.s, uv.t));         
            
            // **************** EDITAR A PARTIR DE AQUI *******************************
            // Posicion de la esfera, cambio la escala del vector normal de forma localizada.
            // Con el vertex shader puedo hacer cualquier tipo de modificacion de las posiciones
            // realizamos una transformacion no lineal --> DEFORMACIONES.
            // Una Deformacion 
            
            position+=normal*(1.0+sin(uv.x*18.0*PI+time*20.0))*0.03; 
            // nuevoVector = normal.xyy
            /*
            //Otra Deformacion
            float a = position.y*2.0; //un angulo varia linealmente en funcion de y  
            //aplico una rotacion
            position.x = cos(a)*position.x+sin(a)*position.z;
            position.z = -sin(a)*position.x + cos(a)*position.z;
            */

            // ************************************************************************
            //Aplicamos la matrix de modelado, y obtemos la pos de mundo
            vec4 worldPos = uMMatrix*vec4(position, 1.0);               

            //Salida: Cual es la posicion modificada de ese vertice //OBLIGATORIO
            //aplicamos la matrix de vista --> obtenemos la pos en es espacio de camara
            //aplicamos la matrix de proyeccion --> obtenemos la coord en el espacio de pantalla
            //(espacio normalizado que luego se transforma en 2 dimensiones)
            //
            //Ahora el rasterizador sabe donde dibujar en 2 dimensiones el triangulo
            //(WebGl dibuja triangulos en 2 dimensiones, nosotros con las transformaciones logramas dar perspectiva)
            gl_Position = uPMatrix*uVMatrix*worldPos;
            //3 Salidas adicionales, para iluminacion
            vWorldPosition=worldPos.xyz;              
            vNormal=normalize(uNMatrix * aNormal);
            vUv=uv;	//donde cae cada vertice, que punto de la imagen de la tierra le corresponde cada vertice MAPEO
        }