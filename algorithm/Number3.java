import java.util.Arrays;

/**
 * Minimum runtime: Java 8
 */
public class Number3 {

    public static void main(String[] args) {
        String[] input = {"xc", "dz", "bbb", "dz"};
        String[] query = {"bbb", "ac", "dz"};

        int[] output = count(input, query);

        System.out.printf("Input: %s\n", Arrays.toString(input));
        System.out.printf("Query: %s\n", Arrays.toString(query));
        System.out.printf("Output: %s\n", Arrays.toString(output));
    }

    public static int[] count(String[] input, String[] query) {
        int[] result = new int[query.length];

        for (int i = 0; i < query.length; i++) {
            int wordsCount = 0;

            for (String in : input) {
                if (in.equals(query[i]))
                    wordsCount++;
            }
            result[i] = wordsCount;
        }

        return result;
    }
}
