
/**
 * Minimum runtime: Java 8
 */
public class Number2 {

    public static void main(String[] args) {
        String input = "Saya sangat senang mengerjakan soal algoritma";
        String result = longest(input);

        System.out.printf("Input: %s\n", input);
        System.out.printf("Hasil: %s\n", result);
    }

    public static String longest(String text) {
        String[] words = text.split(" ");

        String longestWord = words[0];
        for (int i = 1; i < words.length; i++) {
            String nextLongestWord = words[i];
            if (nextLongestWord.length() > longestWord.length()) {
                longestWord = nextLongestWord;
            }
        }

        return String.format("%s: %d character", longestWord, longestWord.length());
    }
}
