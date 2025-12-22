export const findUserByEmail = async(collection, email) => {
    const result = collection.findOne({ email: email});
    return result;
}