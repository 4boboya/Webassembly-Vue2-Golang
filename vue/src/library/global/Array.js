export default new class ArrayTools {
    Diff(template, condition) {
        let minLength = template.length;
        let maxLength = condition.length;
        let diffIndex = [];
        let diffArray = 'template';
        if (minLength > condition.length) {
            minLength = condition.length;
            maxLength = template.length;
            diffArray = 'condition';
        }
        let notdefinedindex = maxLength - minLength;
        for (let i = 0; i < minLength; i++) {
            if (condition[i] != template[i]) diffIndex.push(i);
        }
        for (let i = 0; i < notdefinedindex; i++) {
            diffIndex.push(i + minLength);
        }
        return { diffArray, diffIndex };
    }
    Dimension(array, offset) {
        let defaultOffset = offset;
        let newArray = [];
        let targetIndex = (array.length / offset).toFixed(0);
        let index = 0;
        for (let i = 0; i <= targetIndex; i++) {
            if (array.slice(index, offset).length != 0) newArray.push(array.slice(index, offset));
            index = offset;
            offset += defaultOffset;
        }
        return newArray;
    }
    Swap(array, targetIndex, toIndex = -1) {
        if (oldArray[0] == undefined) return oldArray;
        let newArray = [];
        let outOfRange = toIndex < 0 || toIndex >= array.length;
        toIndex = outOfRange ? array.length - 1 : toIndex;
        targetIndex = targetIndex >= array.length ? array.length - 1 : targetIndex;
        newArray = array;
        let temp = array[toIndex];
        newArray[toIndex] = array[targetIndex];
        newArray[targetIndex] = temp;
        return newArray;
    }
    Reorganization(oldArray, targetIndex) {
        if (oldArray[0] == undefined) return oldArray;
        let newArray = [];
        targetIndex = (targetIndex >= oldArray.length) ? oldArray.length - 1 : targetIndex;
        newArray.push(oldArray[targetIndex]);
        delete oldArray[targetIndex];
        array = Object.values(oldArray);
        newArray = newArray.concat(oldArray);
        return newArray;
    }
}
