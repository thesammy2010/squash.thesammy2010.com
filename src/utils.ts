export const timeout = (delay: number) => {
    return new Promise( res => setTimeout(res, delay) );
}


export const timedWait = () => {
    return timeout(200 * Math.random())
}
