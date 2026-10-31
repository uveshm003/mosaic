import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

/// The providers behind the visualiser, as written in lib/src/shop.dart.
class CodePage extends StatelessWidget {
  const CodePage({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return PageBody(
      children: [
        Text('The providers', style: text.headlineSmall),
        Text(
          'Three sources the user changes, four derived values. Riverpod recomputes a '
          'derived provider only when something it watches changes, and skips the '
          'update when the new value equals the old one.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        const CodeBlock(
          'final cartProvider =\n'
          '    NotifierProvider<CartNotifier, Map<String, int>>(CartNotifier.new);\n\n'
          'final itemCountProvider = Provider<int>(\n'
          '  (ref) => ref.watch(cartProvider).values.fold(0, (a, b) => a + b),\n'
          ');\n\n'
          'final subtotalProvider = Provider<double>((ref) {\n'
          '  final cart = ref.watch(cartProvider);\n'
          '  return products.fold(0, (sum, p) => sum + p.price * (cart[p.id] ?? 0));\n'
          '});\n\n'
          'final totalProvider = Provider<double>((ref) {\n'
          '  final subtotal = ref.watch(subtotalProvider);\n'
          '  return ref.watch(discountProvider) ? subtotal * 0.9 : subtotal;\n'
          '});\n\n'
          'final totalLabelProvider = Provider<String>((ref) => formatMoney(\n'
          '  ref.watch(totalProvider),\n'
          '  ref.watch(currencyProvider),\n'
          '));',
        ),
        const SizedBox(height: 16),
        Text('A row that watches only its own line', style: text.titleMedium),
        const SizedBox(height: 8),
        const CodeBlock(
          'final quantity = ref.watch(\n'
          '  cartProvider.select((cart) => cart[product.id] ?? 0),\n'
          ');',
        ),
        const SizedBox(height: 16),
        Text('How the graph hears about updates', style: text.titleMedium),
        const SizedBox(height: 8),
        const CodeBlock(
          'final class ActivityObserver extends ProviderObserver {\n'
          '  @override\n'
          '  void didUpdateProvider(context, previousValue, newValue) {\n'
          '    activity.record(context.provider.name, previousValue, newValue);\n'
          '  }\n'
          '}',
        ),
      ],
    );
  }
}
