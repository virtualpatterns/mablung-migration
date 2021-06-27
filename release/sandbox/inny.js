import '@virtualpatterns/mablung-source-map-support/install';

class A {

  constructor() {}

  doIt() {
    console.log('A.doIt()');
  }

  doThat() {
    console.log('A.doThat()');
    this.doIt();
  }

  static doWhat() {
    console.log('A.doWhat()');
    this.doThat();
  }

  static doThat() {
    console.log('A.doThat()');
  }}



class B extends A {

  constructor() {
    super();
  }

  doIt() {
    console.log('B.doIt()');
  }

  doThat() {
    console.log('B.doThat()');
    super.doThat();
  }

  static doWhat() {
    console.log('B.doWhat()');
    super.doWhat();
  }

  static doThat() {
    console.log('B.doThat()');
  }}



async function main() {

  B.doWhat();

  // let b = new B()
  // b.doThat()

}

main();

//# sourceMappingURL=inny.js.map