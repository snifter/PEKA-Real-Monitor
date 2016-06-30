module.exports = {
  services: {
    bollardDataService: {
      stopPointBollardsApiUrl: "http://www.poznan.pl/mim/plan/map_service.html?mtype=pub_transport&co=cluster"      
    },
    linesDataService: {
      nightBusLinesApiUrl: "https://www.um.poznan.pl/ws/services/MPKLines/getBusLines?json=%7B%22type%22%3A%22n%22%7D",
      dayBusLinesApiUrl: "https://www.um.poznan.pl/ws/services/MPKLines/getBusLines?json=%7B%22type%22%3A%22d%22%7D",
      nightTramLinesApiUrl: "https://www.um.poznan.pl/ws/services/MPKLines/getTramLines?json=%7B%22type%22%3A%22n%22%7D",
      dayTramLinesApiUrl: "https://www.um.poznan.pl/ws/services/MPKLines/getTramLines?json=%7B%22type%22%3A%22d%22%7D"
    }
  },
  databases: {
    mongodb: {
      url : 'mongodb://localhost:27017/peka-real-monitor'
    }
  }
};
