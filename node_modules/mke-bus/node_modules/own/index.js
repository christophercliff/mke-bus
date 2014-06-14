create.readonly = readonly
module.exports = create

function create(properties, isWritable, isConfigurable) {
    if (properties !== Object(properties)) return undefined
    var result = {}
    var name, descriptors, descriptorName, descriptor
    for (name in properties) {
        if (!properties.hasOwnProperty(name)) continue
        result[name] = Object.getOwnPropertyDescriptor(properties, name)
        if (typeof isWritable === 'boolean') result[name].writable = isWritable
        if (typeof isConfigurable === 'boolean') result[name].configurable = isConfigurable
    }
    return result
}

function readonly(properties) {
    return create(properties, false, false)
}
