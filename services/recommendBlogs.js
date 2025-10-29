const blog = require('../model/blogSchema');

async function recommendBlogs(blogId) {
    const currentBlog = await blog.findById(blogId);
    if (!currentBlog) return { relatedBlogs: [], sameAuthorBlogs: [] };

    const otherBlogs = await blog.find({
        _id: { $ne: blogId },
        category: currentBlog.category
    }, 'title description category');

    //calculating the frequency
    function getWordFreq(text) {
        const words = text.toLowerCase().split(/\W+/).filter(Boolean);
        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);
        return freq;
    }
//finding similarity
    function cosineSimilarity(freqA, freqB) {
        let dot = 0, magA = 0, magB = 0;
        const wordsA = Object.keys(freqA);
        const wordsB = Object.keys(freqB);
        const combinedWords = [...new Set([...wordsA, ...wordsB])];

        combinedWords.forEach(word => {
            const a = freqA[word] || 0;
            const b = freqB[word] || 0;
            dot += a * b;
            magA += a * a;
            magB += b * b;
        });

        return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
    }

    // Weighting: title & category appear twice
    const currentFreq = getWordFreq(
        `${currentBlog.title} ${currentBlog.title} ${currentBlog.category} ${currentBlog.description}`
    );

    const relatedBlogs = otherBlogs.map(b => {
        const freq = getWordFreq(
            `${b.title} ${b.category} ${b.description}`
        );
        return {
            _id: b._id,
            title: b.title,
            category: b.category,
            score: cosineSimilarity(currentFreq, freq)
        };
    })
    .filter(b => b.score >= 0.2) // ignore unrelated
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

    const sameAuthorBlogs = await blog.find({
        _id: { $ne: blogId },
        author: currentBlog.author
    }).limit(3);

    return { relatedBlogs, sameAuthorBlogs };
}

module.exports = recommendBlogs;
