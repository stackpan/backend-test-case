/**
 * Minimum runtime: Java 8
 */
public class Number1 {

    public static void main(String[] args) {
        String input = "NEGIE1";
        String result = reverse(input);

        System.out.printf("Input: %s\n", input);
        System.out.printf("Hasil: %s\n", result);
    }

    public static String reverse(String text) {
        String letter = text.substring(0, text.length() - 1);
        String number = text.substring(text.length() - 1);

        char[] letterChars = letter.toCharArray();

        StringBuilder builder = new StringBuilder();
        for (int i = letterChars.length - 1; i >= 0; i--) {
            builder.append(letterChars[i]);
        }

        builder.append(number);
        return builder.toString();
    }
}
