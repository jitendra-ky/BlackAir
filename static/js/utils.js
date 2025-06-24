export async function apiFetch(url, options = {}) {
  const base = '/api';
  const fullUrl = url.startsWith('/api') ? url : base + url;
  const opts = { ...options };
  opts.headers = opts.headers || {};
  
  // Add authorization header if token exists
  const token = localStorage.getItem('accessToken');
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // jQuery's ajax does not support FormData content-type override
  return new Promise((resolve, reject) => {
    $.ajax({
      url: fullUrl,
      method: opts.method || 'GET',
      data: opts.body instanceof FormData ? opts.body : opts.body ? opts.body : undefined,
      processData: !(opts.body instanceof FormData),
      contentType: opts.body instanceof FormData ? false : opts.headers['Content-Type'] || 'application/json',
      headers: opts.headers,
      success: function(data, textStatus, jqXHR) {
        resolve(data);
      },
      error: function(jqXHR) {
        let errMsg = 'API error';
        try {
          const err = jqXHR.responseJSON;
          errMsg = err && (err.detail || JSON.stringify(err));
        } catch {}
        reject(new Error(errMsg));
      }
    });
  });
}
