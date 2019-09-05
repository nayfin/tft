// import { getGreeting } from '../support/app.po';

function movePiece (
  cssSelector: string, 
  path: { x:number, y: number, pause?: number}[]
) {
  // Get the element by it's selector
  cy.get(`${cssSelector}`)
    .trigger('pointerdown')
    .trigger('pointermove', { clientX: 500, clientY: 600 })
    .trigger('pointerup', {force: true})
}

describe('sandbox', () => {
  beforeEach(() => cy.visit('/'));

  it('should wiggle the draggable around a bunch', () => {
    let count = 0;
    // const dragInterval = setInterval(()=>{
    movePiece(`#draggable${0} > .handle`, [{x: 4000, y: 400}]);
    count++;
    // }, 5);
  //   setTimeout(() => {
  //     clearInterval(dragInterval);
      
  //   }, 8000)
  });
});
