import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayOfN'
})
export class ArrayOfNPipe implements PipeTransform {

  /**
   * 
   * @param n the number to make an array of 
   * @param max the max length of the array (useful for limiting rendering in ngFor loop)
   */
  transform(n: number, max: number): any {
    const length = ((max && max < n) || n === Infinity) ? max : n;
    return new Array(length).fill(length).map((x,i)=> i); 
  }

}
