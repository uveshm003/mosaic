import 'package:flutter/material.dart';

/// The site's colours: mint and coral on near-black.
abstract final class DemoColors {
  static const background = Color(0xFF0A0C12);
  static const surface = Color(0xFF12151D);
  static const line = Color(0xFF232836);
  static const mint = Color(0xFF5EEAD4);
  static const coral = Color(0xFFFF8A65);
  static const muted = Color(0xFF8B93A7);
}

ThemeData demoTheme() {
  final scheme =
      ColorScheme.fromSeed(
        seedColor: DemoColors.mint,
        brightness: Brightness.dark,
      ).copyWith(
        primary: DemoColors.mint,
        secondary: DemoColors.coral,
        surface: DemoColors.background,
        surfaceContainer: DemoColors.surface,
        surfaceContainerHigh: DemoColors.surface,
        outlineVariant: DemoColors.line,
      );
  return ThemeData(
    // Bundled in this package, like the site's body font.
    fontFamily: 'packages/demo_kit/Inter',
    colorScheme: scheme,
    scaffoldBackgroundColor: DemoColors.background,
    cardTheme: const CardThemeData(
      color: DemoColors.surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
        side: BorderSide(color: DemoColors.line),
      ),
    ),
    dividerTheme: const DividerThemeData(color: DemoColors.line),
  );
}
