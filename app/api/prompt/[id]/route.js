import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';
import { trusted } from 'mongoose';

// GET
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate('creator'); // populate the creator to know who created the post
    if (!prompt) return new Response('Prompt not found', { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch all prompts', { status: 500 });
  }
};

// PATCH
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt)
      return new Response('Prompt not found', { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();
    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to update prompt', { status: 500 });
  }
};

// DELETE
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    const promptToDelete = await Prompt.findByIdAndDelete(params.id);
    if (!promptToDelete)
      return new Response('Prompt not found', { status: 404 });
    return new Response('Prompt deleted successfully', { status: 400 });
  } catch (error) {
    return new Response('Failed to delete prompt', { status: 500 });
  }
};
