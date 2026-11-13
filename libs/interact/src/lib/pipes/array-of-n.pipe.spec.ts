import { ArrayOfNPipe } from './array-of-n.pipe';

describe('ArrayOfNPipe', () => {
  const pipe = new ArrayOfNPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the indexes 0 to n - 1', () => {
    expect(pipe.transform(3, undefined)).toEqual([0, 1, 2]);
  });

  it('should return an empty array for 0', () => {
    expect(pipe.transform(0, undefined)).toEqual([]);
  });

  it('should limit the length to max when max is smaller than n', () => {
    expect(pipe.transform(10, 2)).toEqual([0, 1]);
  });

  it('should ignore max when it is larger than n', () => {
    expect(pipe.transform(2, 10)).toEqual([0, 1]);
  });

  it('should use max as the length when n is Infinity', () => {
    expect(pipe.transform(Infinity, 3)).toEqual([0, 1, 2]);
  });
});
