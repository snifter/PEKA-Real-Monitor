module.exports = {
  services: {
    bollardDataService: {
      stopPointBollardsApiUrl : 'http://www.poznan.pl/mim/plan/map_service.html?mtype=pub_transport&co=cluster'      
    }
  },
  databases: {
    mongodb: {
      url : 'mongodb://localhost:27017/peka-real-monitor'
    }
  }
};
