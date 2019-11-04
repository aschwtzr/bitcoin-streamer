import axios from "axios";

const url = 'https://blockchain.info/ticker';

const base = axios.create({
  url,
  responseType: "json"
});

export const fetchBTCPrice = () => {
  return base.get('https://blockchain.info/ticker')
}
