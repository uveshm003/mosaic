import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'activity.dart';
import 'graph.dart';
import 'shop.dart';

/// Whether product rows watch only their own line of the cart. Not drawn in the
/// graph: it's a setting of the demo, not of the shop.
class UseSelect extends Notifier<bool> {
  @override
  bool build() => true;

  void set(bool value) => state = value;
}

final useSelectProvider = NotifierProvider<UseSelect, bool>(UseSelect.new);

/// Counts builds per product row, to show what `select` saves.
final rowBuilds = <String, int>{};

class VisualiserPage extends StatelessWidget {
  const VisualiserPage({super.key, required this.activity});

  final Activity activity;

  @override
  Widget build(BuildContext context) {
    // Measure the space beside the navigation, not the window.
    return LayoutBuilder(
      builder: (context, box) {
        final wide = box.maxWidth >= 1000;
        final graph = Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: SizedBox(
              height: box.maxWidth < verticalBelow + 68 ? 360 : 330,
              child: ProviderGraph(activity: activity),
            ),
          ),
        );
        const shop = _Shop();
        final log = _Log(activity: activity);
        return SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: wide
              ? Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Expanded(flex: 4, child: shop),
                    const SizedBox(width: 20),
                    Expanded(
                      flex: 5,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [graph, const SizedBox(height: 16), log],
                      ),
                    ),
                  ],
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    graph,
                    const SizedBox(height: 16),
                    shop,
                    const SizedBox(height: 16),
                    log,
                  ],
                ),
        );
      },
    );
  }
}

class _Shop extends ConsumerWidget {
  const _Shop();

  // Watches only the select setting: the totals and controls below are their own
  // consumers, so a cart change never rebuilds the rows through this parent.
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final text = Theme.of(context).textTheme;
    final useSelect = ref.watch(useSelectProvider);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Shop', style: text.headlineSmall),
        Text(
          'Change anything and watch which providers recompute.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [for (final p in products) _ProductRow(product: p)],
          ),
        ),
        const SizedBox(height: 8),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Rows use select'),
          subtitle: Text(
            useSelect
                ? 'Each row rebuilds only when its own quantity changes'
                : 'Every row rebuilds on any cart change',
          ),
          value: useSelect,
          onChanged: (v) {
            rowBuilds.clear();
            ref.read(useSelectProvider.notifier).set(v);
          },
        ),
        const _Controls(),
        const SizedBox(height: 16),
        const _Summary(),
      ],
    );
  }
}

class _Controls extends ConsumerWidget {
  const _Controls();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Discount code (10%)'),
          value: ref.watch(discountProvider),
          onChanged: (_) => ref.read(discountProvider.notifier).toggle(),
        ),
        const SizedBox(height: 4),
        SegmentedButton<Currency>(
          segments: [
            for (final c in Currency.values)
              ButtonSegment(value: c, label: Text(c.name.toUpperCase())),
          ],
          selected: {ref.watch(currencyProvider)},
          showSelectedIcon: false,
          onSelectionChanged: (s) =>
              ref.read(currencyProvider.notifier).set(s.first),
        ),
      ],
    );
  }
}

class _Summary extends ConsumerWidget {
  const _Summary();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final text = Theme.of(context).textTheme;
    return Row(
      children: [
        Text('${ref.watch(itemCountProvider)} items', style: text.bodyLarge),
        const Spacer(),
        Text(ref.watch(totalLabelProvider), style: text.headlineSmall),
      ],
    );
  }
}

class _ProductRow extends ConsumerWidget {
  const _ProductRow({required this.product});

  final Product product;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quantity = ref.watch(useSelectProvider)
        ? ref.watch(cartProvider.select((cart) => cart[product.id] ?? 0))
        : ref.watch(cartProvider)[product.id] ?? 0;
    final builds = rowBuilds[product.id] = (rowBuilds[product.id] ?? 0) + 1;
    final cart = ref.read(cartProvider.notifier);
    final currency = ref.watch(currencyProvider);
    return ListTile(
      title: Text(product.name),
      subtitle: Text(
        '${formatMoney(product.price, currency)} · built ×$builds',
        style: const TextStyle(color: DemoColors.muted),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            tooltip: 'Remove ${product.name}',
            onPressed: quantity == 0 ? null : () => cart.remove(product.id),
            icon: const Icon(Icons.remove_circle_outline),
          ),
          SizedBox(
            width: 24,
            child: Text('$quantity', textAlign: TextAlign.center),
          ),
          IconButton(
            tooltip: 'Add ${product.name}',
            onPressed: () => cart.add(product.id),
            icon: const Icon(Icons.add_circle_outline),
          ),
        ],
      ),
    );
  }
}

class _Log extends StatelessWidget {
  const _Log({required this.activity});

  final Activity activity;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return ListenableBuilder(
      listenable: activity,
      builder: (context, _) => Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('ProviderObserver log', style: text.titleSmall),
              const SizedBox(height: 8),
              if (activity.events.isEmpty)
                Text(
                  'Nothing yet. Add something to the cart.',
                  style: text.bodySmall?.copyWith(color: DemoColors.muted),
                ),
              for (final e in activity.events.take(8))
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text(
                    '${e.provider}: ${e.from} → ${e.to}',
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: 'JetBrainsMono',
                      package: 'demo_kit',
                      fontSize: 12,
                      color: DemoColors.muted,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
