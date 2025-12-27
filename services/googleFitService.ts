
import { SleepRecord } from "../types";

// 注意：在生产应用中，CLIENT_ID 应存储在环境变量中。
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.heart_rate.read";

export class GoogleFitService {
  private accessToken: string | null = null;

  async authorize(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log("正在启动 Google Fit 授权...");
      // 模拟授权流程
      setTimeout(() => {
        this.accessToken = "mock_token_" + Date.now();
        resolve(true);
      }, 1000);
    });
  }

  async fetchSleepData(days: number = 7): Promise<SleepRecord[]> {
    if (!this.accessToken) return [];

    const endTime = Date.now();
    const startTime = endTime - days * 24 * 60 * 60 * 1000;

    try {
      // 尝试调用真实的 Fitness API
      const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aggregateBy: [
            { dataTypeName: "com.google.sleep.segment" },
            { dataTypeName: "com.google.heart_rate.bpm" }
          ],
          bucketByTime: { durationMillis: 86400000 }, 
          startTimeMillis: startTime,
          endTimeMillis: endTime,
        })
      });

      if (!response.ok) {
        // 如果 API 调用失败（通常是因为 Mock Token 无效），我们回退到模拟数据
        console.warn("Google Fit API 调用失败，切换到演示模式数据...");
        return this.generateMockFitData(days);
      }

      const data = await response.json();
      return this.parseFitData(data);
    } catch (error) {
      console.error("Google Fit 获取错误，正在生成演示数据:", error);
      // 捕捉网络错误并返回模拟数据，确保应用功能不中断
      return this.generateMockFitData(days);
    }
  }

  private generateMockFitData(days: number): SleepRecord[] {
    const records: SleepRecord[] = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      records.push({
        id: `fit-sim-${i}`,
        date: dateStr,
        score: Math.floor(Math.random() * 25) + 70,
        durationHours: Number((6.5 + Math.random() * 2.5).toFixed(1)),
        stages: { 
          deep: Math.floor(Math.random() * 10) + 15, 
          rem: Math.floor(Math.random() * 10) + 20, 
          light: 45, 
          awake: 5 
        },
        heartRate: { 
          avg: Math.floor(Math.random() * 10) + 55, 
