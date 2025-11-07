/**
 * 에러 응답에서 메시지를 추출하는 유틸리티
 * 새로운 표준 형식과 기존 형식을 모두 지원
 */
export function extractErrorMessage(error) {
  if (!error) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  // Axios 에러 응답이 있는 경우
  if (error.response?.data) {
    const data = error.response.data;
    
    // 새로운 표준 형식: { code, message, details, timestamp }
    if (data.message) {
      return data.message;
    }
    
    // 기존 형식: { error: "..." }
    if (data.error) {
      return data.error;
    }
    
    // 문자열로 직접 전달된 경우
    if (typeof data === 'string') {
      return data;
    }
  }

  // 에러 메시지가 있는 경우
  if (error.message) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 에러 코드를 추출하는 유틸리티
 */
export function extractErrorCode(error) {
  if (error.response?.data?.code) {
    return error.response.data.code;
  }
  return null;
}

