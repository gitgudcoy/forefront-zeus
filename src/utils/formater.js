function generateProductCode(storeId,namaBarang){
    const IdProductCode = Math.floor(Math.random() * 9999999999)
    const  product = `${storeId}//${namaBarang}//${IdProductCode}`
    return product
}


module.exports = {
    generateProductCode

}
