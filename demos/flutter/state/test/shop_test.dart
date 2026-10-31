import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:state_visualiser/src/activity.dart';
import 'package:state_visualiser/src/shop.dart';

void main() {
  late Activity activity;
  late ProviderContainer container;

  setUp(() {
    activity = Activity();
    container = ProviderContainer(observers: [ActivityObserver(activity)]);
    // Listen like the UI does, so derived providers stay live.
    container.listen(totalLabelProvider, (_, _) {});
    container.listen(itemCountProvider, (_, _) {});
  });

  tearDown(() => container.dispose());

  test('totals follow the cart, the discount and the currency', () {
    container.read(cartProvider.notifier)
      ..add('mug')
      ..add('mug')
      ..add('tote');
    expect(container.read(itemCountProvider), 3);
    expect(container.read(totalLabelProvider), '€42.00');
    container.read(discountProvider.notifier).toggle();
    expect(container.read(totalLabelProvider), '€37.80');
    container.read(currencyProvider.notifier).set(Currency.usd);
    expect(container.read(totalLabelProvider), r'$40.82');
  });

  test('removing the last of an item drops it from the cart', () {
    container.read(cartProvider.notifier)
      ..add('stickers')
      ..remove('stickers');
    expect(container.read(cartProvider), isEmpty);
  });

  test('changing the currency recomputes only the label', () async {
    container.read(cartProvider.notifier).add('mug');
    container.read(totalLabelProvider);
    activity.reset();
    container.read(currencyProvider.notifier).set(Currency.inr);
    container.read(totalLabelProvider);
    expect(activity.updates.keys.toSet(), {'currency', 'totalLabel'});
  });

  test('the graph lists every named provider', () {
    for (final deps in providerGraph.values) {
      for (final d in deps) {
        expect(providerGraph.containsKey(d), isTrue, reason: d);
      }
    }
    expect(providerGraph.keys, containsAll(['cart', 'subtotal', 'totalLabel']));
  });
}
