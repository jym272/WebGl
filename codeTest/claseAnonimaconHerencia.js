
function BlueGlassBrick() {

  let opcion;
  this.crearopcion = function (nuevaOpcion) {
    opcion = nuevaOpcion;
  };
  this.doitonce = function (nuevoBlue) {
    return opcion.doitonce(nuevoBlue);
  };
  this.reset = function () {
    opcion.reset();
  };
  this.resetOther = function (instanceBlue) {
    instanceBlue.reset();
  };
}
function opcion2() {
  let executed;
  let superficieExterna;
  this.reset = function () {
    executed = false;
  };
  this.doitonce = function (opcion) {
    superficieExterna = opcion;
    return foo();
  };
  var foo = (function () {
    executed = false;
    return function () {
      if (!executed) {
        superficieExterna.reset();
        executed = true;
        return 22;
      }
    };
  })();
}

function opcion1() {
  let executed;
  let superficieExterna;
  this.reset = function () {
    executed = false;
  };
  this.doitonce = function (opcion) {
    superficieExterna = opcion;
    return foo();
  };
  var foo = (function () {
    executed = false;
    return function () {
      if (!executed) {
        superficieExterna.reset();
        executed = true;
        return 21;
      }
    };
  })();
}
let B = new BlueGlassBrick;
let C = new BlueGlassBrick;
let opcionA = new opcion1;
let opcionB = new opcion2;

B.crearopcion(opcionA);
C.crearopcion(opcionB);

console.log(B.doitonce(C));
console.log(B.doitonce(B));


console.log(B.doitonce(C));
console.log(B.doitonce(C));
console.log(C.doitonce(B));
console.log(C.doitonce(B));

console.log(C.doitonce(B));
console.log(C.doitonce(B));


//C.resetOther(B);
//B.resetOther(C);



/*
public class Cocina {
  private Cocinero cocinero;
  public Comida cocinar() {
  return this.cocinero.cocinar()
  }
  public void reemplazarCocinero(Cocinero nuevoCocinero) {
  this.cocinero = nuevoCocinero;
  }
  }*/