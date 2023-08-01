export class Event{
    private _listeners: (() => void)[] = []
    public addListener(listener: () => void){
        this._listeners.push(listener);
    }
    public removeListener(listener: () => void){
        this._listeners.splice(this._listeners.indexOf(listener), 1);
    }
    public invoke(){
        this._listeners.forEach(l => l())
    }
}
export class EventP<T>{
    private _listeners: ((v:T) => void)[] = []
    public addListener(listener: (v:T) => void){
        this._listeners.push(listener);
    }
    public removeListener(listener: (v:T) => void){
        this._listeners.splice(this._listeners.indexOf(listener), 1);
    }
    public invoke(v:T){
        this._listeners.forEach(l => l(v))
    }
}