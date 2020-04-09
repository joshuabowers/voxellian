/**
 * A poor man's profiler: will log to console the approximate amount 
 * of time the passed function took to execute. Not meant to be
 * accurate!
 * @param methodName a description of the function being profiled
 * @param fn the code to profile.
 * @returns the value of the passed function
 */
export function profile<T>( methodName: string, fn: () => T ){
  const startTime = Date.now();
  const result = fn();
  const endTime = Date.now();
  console.log( methodName, "execution time:", endTime - startTime, "ms" );
  return result;
}
