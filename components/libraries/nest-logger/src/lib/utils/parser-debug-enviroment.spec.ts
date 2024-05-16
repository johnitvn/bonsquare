// Import hàm parseDebugEnviroment từ file của bạn
import { parseDebugEnviroment } from './parser-debug-enviroment';

describe('parseDebugEnviroment', () => {
  it('should correctly parse debug environment string with includes and excludes', () => {
    // Chuỗi biến môi trường debug
    const debugEnviroment = '*Controller,!AuthController,SpecialController';

    // Gọi hàm parseDebugEnviroment để phân tích chuỗi này
    const { includes, excludes } = parseDebugEnviroment(debugEnviroment);

    // Kiểm tra kết quả
    expect(includes).toEqual(['*Controller', 'SpecialController']);
    expect(excludes).toEqual(['AuthController']);
  });

  it('should correctly parse debug environment string with only includes', () => {
    // Chuỗi biến môi trường debug chỉ có includes
    const debugEnviroment = '*Controller,SpecialController';

    // Gọi hàm parseDebugEnviroment để phân tích chuỗi này
    const { includes, excludes } = parseDebugEnviroment(debugEnviroment);

    // Kiểm tra kết quả
    expect(includes).toEqual(['*Controller', 'SpecialController']);
    expect(excludes).toEqual([]);
  });

  it('should correctly parse debug environment string with only excludes', () => {
    // Chuỗi biến môi trường debug chỉ có excludes
    const debugEnviroment = '!AuthController';

    // Gọi hàm parseDebugEnviroment để phân tích chuỗi này
    const { includes, excludes } = parseDebugEnviroment(debugEnviroment);

    // Kiểm tra kết quả
    expect(includes).toEqual([]);
    expect(excludes).toEqual(['AuthController']);
  });

  it('should correctly parse debug environment string with no includes or excludes', () => {
    // Chuỗi biến môi trường debug không có includes hoặc excludes
    const debugEnviroment = '';

    // Gọi hàm parseDebugEnviroment để phân tích chuỗi này
    const { includes, excludes } = parseDebugEnviroment(debugEnviroment);

    // Kiểm tra kết quả
    expect(includes).toEqual([]);
    expect(excludes).toEqual([]);
  });
});
