
class Data {
    static filterUndefined(dataObject: Object): Object {
        return Object.fromEntries(
            Object.entries(dataObject).filter(([_, value]) => value !== undefined)
        );
    }
}

export default Data;