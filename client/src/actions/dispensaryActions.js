import axios from 'axios';
import { GET_DISPENSARY_BY_ACCOUNT } from './types';

const API_ROOT = '/api';

export function getDispensaryByAccount(accountId) {
    return (dispatch) => {
        axios.post(`${API_ROOT}/get/dispensary/byaccount/${accountId}`).then((response) => {
            dispatch({
                type: GET_DISPENSARY_BY_ACCOUNT,
                payload: response.data,
            });
        });
    };
}