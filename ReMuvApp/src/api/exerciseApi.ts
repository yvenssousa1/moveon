// Integração com ExerciseDB (RapidAPI) para buscar vídeos de exercícios
// https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb/

export async function fetchExerciseVideo(query: string): Promise<string | null> {
  try {
    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'SUA_CHAVE_RAPIDAPI_AQUI', // Substitua pela sua chave
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    });
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // O ExerciseDB retorna um GIF, mas você pode adaptar para vídeo de outra fonte
      return data[0].gifUrl || null;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    return null;
  }
}
