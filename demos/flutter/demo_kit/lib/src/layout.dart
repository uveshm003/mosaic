import 'theme.dart';
import 'package:flutter/material.dart';

/// The Dart behind what's on screen, updated as the controls change.
class CodeBlock extends StatelessWidget {
  const CodeBlock(this.code, {super.key});

  final String code;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: DemoColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: DemoColors.line),
      ),
      child: SelectableText(
        code,
        style: const TextStyle(
          fontFamily: 'JetBrainsMono',
          package: 'demo_kit',
          fontSize: 13,
          height: 1.5,
          color: DemoColors.muted,
        ),
      ),
    );
  }
}

/// A page body: centred, width-limited and scrollable.
class PageBody extends StatelessWidget {
  const PageBody({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: children,
          ),
        ),
      ),
    );
  }
}
