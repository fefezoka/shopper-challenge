import {
  GenerateContentRequest,
  GenerateContentResult,
  GoogleGenerativeAI,
  Part,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  async generateContent(
    request: GenerateContentRequest | string | Array<string | Part>,
  ): Promise<GenerateContentResult> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    return await model.generateContent(request);
  }
}
