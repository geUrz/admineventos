import registerHandler from '@/libs/registerHandler';

export default function handler(req, res) {
  if (req.method === 'POST') {
    return registerHandler(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
