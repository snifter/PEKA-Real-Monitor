class BollardRepository {
  
  bollardExist(code) {
    return new Promise((resolve, reject) => {
      console.log(`bollardExist(${code})`);
      resolve(false);
    });
  }
  
  insert(data) {
    /*
      {
        name: String,
        code: String,
        position: [longitude,latitude]
      }
    */
    return new Promise((resolve, reject) => {
      console.log(`insert({name: '${data.name}', code: '${data.code}'})`);
      resolve();
    });
  }
}

module.exports = BollardRepository;