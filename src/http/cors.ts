import { ResponseHeader } from './header';
import { QUERY_STUDIO_ALLOWED_ORIGIN } from './http.constants';

export function cors(res: Response) {
    res.headers.set(ResponseHeader.ACCESS_CONTROL_ALLOW_ORIGIN, QUERY_STUDIO_ALLOWED_ORIGIN || "*");
    res.headers.set(ResponseHeader.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
}
