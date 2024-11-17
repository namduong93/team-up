import { http, HttpResponse } from 'msw';
import { backendURL } from '../../config/backendURLConfig';

export const handlers = [

  http.get(`http://127.0.0.1:8000/user/type`, async ({ params }) => {

    const res = HttpResponse.json({ type: 'system_admin' }, { status: 200 });
    return res;
  })

]